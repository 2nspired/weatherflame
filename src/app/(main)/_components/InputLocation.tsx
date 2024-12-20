// TODO: HANDLE NO VALUES RETURNED (i.e. no valid results returned, but not an error)

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { api } from '~/trpc/client';
import { abbreviateState } from '~/utilities/formatters/abbreviateState';

const locationSchema = z.object({
  name: z
    .string()
    .nonempty('client: Please enter a location')
    .refine(
      (value) => /^[0-9]{5}$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
      'client: Enter a valid zipcode or city',
    ),
});

export default function InputLocation({ className }: { className?: string }) {
  const [noNameData, setNoNameData] = useState(false);
  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<z.infer<typeof locationSchema>> = async (data) => {
    const location = data.name.trim();
    setNoNameData(false);
    try {
      let zipData = null;
      let nameData = null;

      if (/^\d{5}$/.test(location)) {
        zipData = await fetchGeoByZip.mutateAsync({ zip: location });

        if (zipData?.name) {
          nameData = await fetchGeoByName.mutateAsync({
            name: zipData.name,
            countryCode: zipData.country ?? 'US',
          });
        }
      } else {
        nameData = await fetchGeoByName.mutateAsync({
          name: location,
          countryCode: 'US',
        });
      }

      console.log('nameData', nameData);

      if (zipData && nameData?.[0]) {
        router.push(
          `/weather/alerts/${encodeURIComponent(zipData.country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(zipData.name)}/${encodeURIComponent(location)}`,
        );
      }

      if (nameData?.[0] && !zipData) {
        router.push(
          `/weather/alerts/${encodeURIComponent(nameData[0].country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(nameData[0].name)}`,
        );
      }

      if (!nameData?.[0]) {
        setNoNameData(true);
      }
    } catch (error) {
      console.error('Error fetching geo data:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormControl>
                <Input
                  disabled={fetchGeoByZip.isPending || fetchGeoByName.isPending}
                  placeholder="zipcode or city"
                  className="w-40 text-sm text-black"
                  {...field}
                />
              </FormControl>
              <div className="min-h-[2.50rem]">
                <FormMessage className="text-xs text-red-500">
                  {fetchGeoByZip.error?.data?.zodError?.fieldErrors.zip}
                  {fetchGeoByName.error?.data?.zodError?.fieldErrors.name}
                  {noNameData && 'City not found'}, {noNameData && 'USA Only'}
                </FormMessage>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
