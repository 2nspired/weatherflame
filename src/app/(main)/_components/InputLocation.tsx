'use client';

import { type Library } from '@googlemaps/js-api-loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useJsApiLoader } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
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

const glibraries: Library[] = ['places'];

export default function InputLocation({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
}) {
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

  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();

  // Handles form submission
  const onSubmit: SubmitHandler<z.infer<typeof locationSchema>> = useCallback(
    async (data) => {
      try {
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
        }

        // City Name Handling
        if (autoComplete) {
          const place = autoComplete.getPlace();
          if (place?.formatted_address) {
            const [name, state, country] = place.formatted_address.split(',');
            router.push(
              `/weather/${encodeURIComponent(country?.trim() ?? 'us')}/${encodeURIComponent(
                abbreviateState(state?.trim() ?? ''),
              )}/${encodeURIComponent(name?.trim() ?? '')}`,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching geo data:', error);
      }
    },
    [autoComplete, fetchGeoByZip, fetchGeoByName, router],
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
        const place = autoComplete.getPlace();
        if (place?.formatted_address) {
          const [name, state] = place.formatted_address.split(',');
          let formattedValue = '';
          if (name && state) {
            formattedValue = `${name.trim()}, ${abbreviateState(state.trim())}`;
            form.setValue('name', formattedValue, { shouldValidate: true });
            form
              .handleSubmit(onSubmit)()
              .catch((error) => {
                console.error('Error submitting form:', error);
              });

            // Update input field to display "City, State"
            if (placeAutoCompleteRef.current) {
              placeAutoCompleteRef.current.value = formattedValue;
            }
          }

          // Update input field to display "City, State"
          if (placeAutoCompleteRef.current) {
            placeAutoCompleteRef.current.value = formattedValue;
          }
        }
      });
    }
  }, [autoComplete, form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
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
                />
              </FormControl>
              <FormMessage className="font-mono text-xs text-red-500">
                {fetchGeoByZip.error?.data?.zodError?.fieldErrors.zip ??
                  fetchGeoByName.error?.data?.zodError?.fieldErrors.name}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className={`${buttonClassName}md:w-2/6`}>
          <Button
            type="submit"
            className="w-20 rounded-none bg-[#FF6100] font-mono hover:bg-[#FF6100]"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {fetchGeoByZip.isPending || fetchGeoByName.isPending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
