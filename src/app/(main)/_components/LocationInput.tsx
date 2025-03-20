'use client';

import { type Library } from '@googlemaps/js-api-loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useJsApiLoader } from '@react-google-maps/api';
import { Loader2, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { env } from '~/env';
import { api } from '~/trpc/client';
import { stateAbv } from '~/utilities/formatters/stateAbv';

const locationSchema = z.object({
  name: z
    .string()
    .nonempty('Please enter a location')
    .refine(
      (value) => /^\d{5}$/.test(value) || /^[a-zA-Z\s]+,\s*[A-Z]{2}$/.test(value),
      'Enter zipcode or city',
    ),
});

export default function LocationInput({
  className,
  buttonClassName,
  enableUserLocation,
}: {
  className?: string;
  buttonClassName?: string;
  enableUserLocation?: boolean;
}) {
  const [glibraries] = useState<Library[]>(['places']);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const router = useRouter();

  const reverseGeo = api.location.getLocationReverse.useMutation();
  const geoByZip = api.location.getLocationByZip.useMutation();
  const geoByName = api.location.getLocationByName.useMutation();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API,
    libraries: glibraries,
  });

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  const submitStatus =
    geoByZip.isPending ||
    geoByName.isPending ||
    isFetchingLocation ||
    reverseGeo.isPending ||
    isSubmitting ||
    form.formState.isSubmitting;

  function saveLocation(location: string) {
    localStorage.setItem('location', location);
  }

  // Initialize Google Autocomplete
  useEffect(() => {
    if (isLoaded && placeAutoCompleteRef.current) {
      const autoCompleteInstance = new google.maps.places.Autocomplete(
        placeAutoCompleteRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'us' },
        },
      );
      setAutoComplete(autoCompleteInstance);
    }
  }, [isLoaded]);

  // Handle Autocomplete Place Selection
  // useEffect(() => {
  //     if (autoComplete) {
  //       autoComplete.addListener('place_changed', () => {
  //         const place = autoComplete.getPlace();
  //         if (place?.formatted_address) {
  //           const [name, state] = place.formatted_address.split(',');
  //           let formattedValue = '';
  //           if (name && state) {
  //             formattedValue = `${name.trim()}, ${stateAbv(state.trim())}`;
  //             form.setValue('name', formattedValue, {
  //               shouldValidate: true,
  //               shouldDirty: true,
  //               shouldTouch: true,
  //             });
  //             // Update input field to display "City, State"
  //             if (placeAutoCompleteRef.current) {
  //               placeAutoCompleteRef.current.value = formattedValue;
  //             }
  //           }
  //           void form.trigger('name');
  //         }
  //         if (!isSubmitting) {
  //           void form
  //             .handleSubmit(handleSubmit)()
  //             .catch((error) => {
  //               console.error('Error submitting form:', error);
  //             });
  //         }
  //       });
  //     }
  //   }, [autoComplete, form, handleSubmit, isSubmitting]);

  // Determines if browsers local storage already contains a location and then autofills the input with that location.
  useEffect(() => {
    if (typeof window !== 'undefined' && enableUserLocation) {
      const location = localStorage.getItem('location');
      console.log('locally stored location:', location);
      if (location) {
        form.setValue('name', location, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [enableUserLocation, form]);

  // HANDLERS

  // Use User Location Handler

  const handleGetUserLocation = useCallback(async () => {
    if (submitStatus) return;
    setIsFetchingLocation(true);

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      setIsFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      void (async () => {
        try {
          const reverseGeoData = await reverseGeo.mutateAsync({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            limit: 1,
          });

          if (reverseGeoData?.name && reverseGeoData?.state) {
            form.setValue(
              'name',
              `${reverseGeoData.name}, ${stateAbv(reverseGeoData.state)}`,
              {
                shouldValidate: true,
              },
            );

            saveLocation(`${reverseGeoData.name}, ${stateAbv(reverseGeoData.state)}`);

            router.push(
              `/weather/us/${encodeURIComponent(
                stateAbv(reverseGeoData.state),
              )}/${encodeURIComponent(reverseGeoData.name)}`,
            );
          }
        } catch (error) {
          console.error('Error fetching reverse geo data:', error);
        } finally {
          setIsFetchingLocation(false);
        }
      })();
    });
  }, [reverseGeo, form, router, submitStatus]);

  // Form Submit Handler
  const handleSubmit = useCallback<SubmitHandler<z.infer<typeof locationSchema>>>(
    async (data) => {
      if (submitStatus) {
        return;
      }
      setIsSubmitting(true);

      try {
        const [name, state] = data.name.trim().split(',');

        const location = data.name.trim();

        if (/^\d{5}$/.test(location)) {
          const zipData = await geoByZip.mutateAsync({ zip: location });

          if (zipData) {
            router.push(
              `/weather/${encodeURIComponent(stateAbv(zipData.state))}/${encodeURIComponent(zipData.name)}`,
            );
          }
          return;
        }

        if (name && state) {
          console.log('name:', name.trim());
          console.log('state:', state.trim());

          const cityData = await geoByName.mutateAsync({
            name: name.trim(),
            state: state.trim(),
          });

          if (cityData) {
            router.push(
              `/weather/us/${encodeURIComponent(stateAbv(cityData.state.trim()))}/${encodeURIComponent(cityData.name.trim())}`,
            );
          }

          // router.push(
          //   `/weather/us/${encodeURIComponent(stateAbv(state.trim()))}/${encodeURIComponent(name.trim())}`,
          // );
          return;
        }

        console.error('Invalid location');
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    },
    [geoByZip, geoByName, router, submitStatus],
  );

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        if (place?.formatted_address) {
          const cleanedAddress = place.formatted_address.replace(/\s*\d{5}$/, '');
          const [name, state] = cleanedAddress.split(',');
          console.log('111111111111name:', name);
          console.log('222222222222state:', state?.trim(), 'length', state?.length);
          let formattedValue: string;
          if (name && state) {
            formattedValue = `${name.trim()}, ${stateAbv(state.trim())}`;
            // formattedValue = `${name.trim()}, ${stateAbv(state.trim())}`;
            form.setValue('name', formattedValue, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            // Update input field to display "City, State"
            if (placeAutoCompleteRef.current) {
              placeAutoCompleteRef.current.value = formattedValue;
            }
          }
          void form.trigger('name');
        }
        if (!isSubmitting) {
          void form
            .handleSubmit(handleSubmit)()
            .catch((error) => {
              console.error('Error submitting form:', error);
            });
        }
      });
    }
    //   }, [autoComplete, form, handleSubmit, isSubmitting]);
  }, [autoComplete, form, isSubmitting, handleSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-48 md:w-64">
              <FormControl>
                <Input
                  disabled={submitStatus}
                  placeholder="city or zip"
                  className="h-10 rounded-none font-mono text-gray-700 outline-none"
                  {...field}
                  ref={placeAutoCompleteRef}
                  type="text"
                  autoComplete="home city"
                />
              </FormControl>
              {!submitStatus && (
                <FormMessage className="font-mono text-xs text-red-500">
                  {geoByZip.error?.data?.zodError?.fieldErrors.zip ??
                    geoByName.error?.data?.zodError?.fieldErrors.name}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        {/* hover:drop-shadow-[0_3px_0_rgba(255,97,0,0.75)] */}
        <div className={`${buttonClassName} md:w-2/6`}>
          <div
            className={`relative h-[40px] w-32 rounded-3xl ${
              !form.formState.isValid || form.formState.isSubmitting || submitStatus
                ? 'bg-none'
                : 'bg-green-500'
            }`}
          >
            <Button
              type="submit"
              className="absolute z-10 w-32 rounded-3xl border border-black bg-[#FF6100] font-mono text-black transition-transform ease-in-out hover:translate-y-[-3px] hover:bg-[#FF6100]"
              disabled={
                !form.formState.isValid || form.formState.isSubmitting || submitStatus
              }
            >
              {submitStatus ? <Loader2 className="size-6 animate-spin" /> : 'Submit'}
              <div></div>
            </Button>
          </div>
          {enableUserLocation && (
            <div className="mt-2 flex flex-row items-center space-x-2 py-1 font-mono text-sm text-zinc-400 transition-colors duration-300 ease-in-out hover:text-[#FF6100]">
              {reverseGeo.isPending ? (
                <div>searching...</div>
              ) : (
                <>
                  <Navigation size={14} />
                  <button
                    disabled={form.formState.isSubmitting || submitStatus}
                    onClick={handleGetUserLocation}
                  >
                    use location
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
