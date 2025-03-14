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
import { abbreviateState } from '~/utilities/formatters/abbreviateState';

const locationSchema = z.object({
  name: z
    .string()
    .nonempty('Please enter a location')
    .refine(
      (value) => /^\d{5}$/.test(value) || /^[a-zA-Z\s]+,\s*[A-Z]{2}$/.test(value),
      'Enter zipcode or city',
    ),
});

export default function InputLocation({
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
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API,
    libraries: glibraries,
  });

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && enableUserLocation) {
      const location = localStorage.getItem('location');
      console.log('location:', location);
      if (location) {
        form.setValue('name', location, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [enableUserLocation, form]);

  const fetchReverseGeo = api.location.getReverseGeo.useMutation();
  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  function saveLocation(location: string) {
    localStorage.setItem('location', location);
  }

  // HANDLERS

  const handleGetUserLocation = useCallback(async () => {
    if (isFetchingLocation) return;
    setIsFetchingLocation(true);

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      setIsFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      void (async () => {
        try {
          const reverseGeoData = await fetchReverseGeo.mutateAsync({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            limit: 1,
          });

          if (reverseGeoData?.[0]?.name && reverseGeoData?.[0]?.state) {
            form.setValue(
              'name',
              `${reverseGeoData[0].name}, ${abbreviateState(reverseGeoData[0].state)}`,
              {
                shouldValidate: true,
              },
            );

            saveLocation(
              `${reverseGeoData[0].name}, ${abbreviateState(reverseGeoData[0].state)}`,
            );

            router.push(
              `/weather/us/${encodeURIComponent(
                abbreviateState(reverseGeoData[0].state),
              )}/${encodeURIComponent(reverseGeoData[0].name)}`,
            );
          }
        } catch (error) {
          console.error('Error fetching reverse geo data:', error);
        } finally {
          setIsFetchingLocation(false);
        }
      })();
    });
  }, [fetchReverseGeo, isFetchingLocation, form, router]);

  const handleSubmit: SubmitHandler<z.infer<typeof locationSchema>> = useCallback(
    async (data) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        if (fetchGeoByZip.isPending || fetchGeoByName.isPending) {
          return;
        }
        const location = data.name.trim();

        // Zip Code Handling
        if (/^\d{5}$/.test(location)) {
          const zipData = await fetchGeoByZip.mutateAsync({ zip: location });
          if (zipData) {
            const nameData = await fetchGeoByName.mutateAsync({
              name: zipData.name,
              countryCode: zipData.country ?? 'US',
            });
            if (nameData?.[0]) {
              router.push(
                `/weather/${encodeURIComponent(
                  zipData.country ?? 'us',
                )}/${encodeURIComponent(
                  abbreviateState(nameData[0].state),
                )}/${encodeURIComponent(zipData.name)}`,
              );
            }
          }
          return;
        }

        // City Name Handling
        if (location) {
          const [name, state] = location.split(',');
          if (name && state) {
            router.push(
              `/weather/us/${encodeURIComponent(abbreviateState(state.trim()))}/${encodeURIComponent(name.trim())}`,
            );
          } else {
            console.error('Invalid location format');
          }
        }
      } catch (error) {
        console.error('Error fetching geo data:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchGeoByZip, fetchGeoByName, router, isSubmitting],
  );

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
  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener('place_changed', () => {
        if (isSubmitting) return;
        void form
          .handleSubmit(handleSubmit)()
          .catch((error) => {
            console.error('Error submitting form:', error);
          });
      });
    }
  }, [autoComplete, form, handleSubmit, isSubmitting]);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        if (place?.formatted_address) {
          const [name, state] = place.formatted_address.split(',');
          let formattedValue = '';
          if (name && state) {
            formattedValue = `${name.trim()}, ${abbreviateState(state.trim())}`;
            form.setValue('name', formattedValue, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            void form
              .handleSubmit(handleSubmit)()
              .catch((error) => {
                console.error('Error submitting form:', error);
              });
            // Update input field to display "City, State"
            if (placeAutoCompleteRef.current) {
              placeAutoCompleteRef.current.value = formattedValue;
            }
          }
          void form.trigger('name');
        }
      });
    }
  }, [autoComplete, form, handleSubmit]);

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
                  disabled={fetchGeoByZip.isPending || fetchGeoByName.isPending}
                  placeholder="city or zip"
                  className="h-10 rounded-none font-mono text-gray-700 outline-none"
                  {...field}
                  ref={placeAutoCompleteRef}
                  type="text"
                  autoComplete="home city"
                />
              </FormControl>
              {!fetchReverseGeo.isPending && (
                <FormMessage className="font-mono text-xs text-red-500">
                  {fetchGeoByZip.error?.data?.zodError?.fieldErrors.zip ??
                    fetchGeoByName.error?.data?.zodError?.fieldErrors.name}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        {/* hover:drop-shadow-[0_3px_0_rgba(255,97,0,0.75)] */}
        <div className={`${buttonClassName} md:w-2/6`}>
          <div className="relative h-[40px] w-32 rounded-3xl bg-green-500">
            <Button
              type="submit"
              className="absolute w-32 rounded-3xl border border-black bg-[#FF6100] font-mono text-black transition-transform ease-in-out hover:translate-y-[-3px] hover:bg-[#FF6100]"
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                isFetchingLocation
              }
            >
              {fetchGeoByZip.isPending || fetchGeoByName.isPending ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                'Submit'
              )}
              <div></div>
            </Button>
          </div>
          {enableUserLocation && (
            <div className="mt-2 flex flex-row items-center space-x-2 py-1 font-mono text-sm text-zinc-400 transition-colors duration-300 ease-in-out hover:text-[#FF6100]">
              {fetchReverseGeo.isPending ? (
                <div>searching...</div>
              ) : (
                <>
                  <Navigation size={14} />
                  <button
                    disabled={
                      form.formState.isSubmitting ||
                      fetchReverseGeo.isPending ||
                      isFetchingLocation
                    }
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
