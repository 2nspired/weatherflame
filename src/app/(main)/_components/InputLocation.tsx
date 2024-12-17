'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
  location: z
    .string()
    .nonempty('Please enter a location')
    .refine(
      (value) => /^[0-9]{5}$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
      'Enter a valid zipcode or city',
    ),
});

export default function InputLocation({ className }: { className?: string }) {
  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: '',
    },
    mode: 'onChange', // Enable validation on change
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<z.infer<typeof locationSchema>> = async (data) => {
    const location = data.location.trim();
    try {
      let zipData = null;
      let nameData = null;

      if (/^\d{5}$/.test(location)) {
        // Check if zip
        zipData = await fetchGeoByZip.mutateAsync({ zip: location });

        if (zipData?.name) {
          nameData = await fetchGeoByName.mutateAsync({
            name: zipData.name,
            countryCode: zipData.country ?? 'US',
          });
        }
      } else {
        // Check if name
        nameData = await fetchGeoByName.mutateAsync({
          name: location,
          countryCode: 'US',
        });
      }

      if (zipData && nameData?.[0]) {
        router.push(
          `/weather/alerts/${encodeURIComponent(zipData.country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(zipData.name)}/${encodeURIComponent(location)}`,
        );
      } else if (nameData?.[0] && !zipData) {
        router.push(
          `/weather/alerts/${encodeURIComponent(nameData[0].country)}/${encodeURIComponent(abbreviateState(nameData[0].state))}/${encodeURIComponent(nameData[0].name)}`,
        );
      }
    } catch (error) {
      console.error('Error fetching geo data:', error);
      alert('Failed to fetch geo coordinates. Please check your input and try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="location"
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
                {form.formState.errors.location && (
                  <FormMessage>{form.formState.errors.location.message}</FormMessage>
                )}
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
