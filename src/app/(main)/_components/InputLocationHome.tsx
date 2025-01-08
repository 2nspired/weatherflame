'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
    .nonempty('Please enter a location')
    .refine(
      (value) => /^[0-9]{5}$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
      'Enter a valid zipcode or city',
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

      if (zipData && nameData?.[0]) {
        router.push(
          `/weather/${encodeURIComponent(zipData.country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(zipData.name)}`,
        );
      }

      if (nameData?.[0] && !zipData) {
        router.push(
          `/weather/${encodeURIComponent(nameData[0].country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(nameData[0].name)}`,
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
            <FormItem className="w-48 md:w-64">
              <FormControl>
                <Input
                  disabled={fetchGeoByZip.isPending || fetchGeoByName.isPending}
                  placeholder="zipcode or city"
                  className="h-10 rounded-none text-gray-700 outline-none"
                  {...field}
                />
              </FormControl>
              <div className="min-h-6">
                <FormMessage className="text-xs text-red-500">
                  {fetchGeoByZip.error?.data?.zodError?.fieldErrors.zip}
                  {fetchGeoByName.error?.data?.zodError?.fieldErrors.name}
                  {noNameData && 'City not found'}
                </FormMessage>
              </div>
            </FormItem>
          )}
        />
        <div className="md:w-2/6">
          <Button
            className="w-20 rounded-none bg-[#FF6100] text-gray-100 hover:bg-[#FF6100]"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
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