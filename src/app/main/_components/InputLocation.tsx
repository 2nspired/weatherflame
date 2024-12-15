'use client';

// TODO: Setup to handle geoByName
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/client';
import { abbreviateState } from '~/utilities/abbreviateState';

const locationSchema = z.object({
  location: z
    .string()
    .nonempty('Please enter a location')
    .refine(
      (value) => /^[0-9]{5}$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
      'Enter a valid ZIP code or city name',
    ),
});

export default function InputLocation() {
  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: '',
    },
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
        nameData = await fetchGeoByName.mutateAsync({
          name: zipData.name,
          countryCode: zipData.country ?? 'US',
        });
      } else {
        // Check if name
        nameData = await fetchGeoByName.mutateAsync({
          name: location,
          countryCode: 'US',
        });
      }

      if (zipData && nameData[0]) {
        router.push(
          `/main/weather/alerts/${zipData.country}/${abbreviateState(nameData[0].state)}/${zipData.name}/${location}`,
        );
      } else if (nameData[0] && !zipData) {
        router.push(
          `/main/weather/alerts/${nameData[0].country}/${abbreviateState(nameData[0].state)}/${nameData[0].name}`,
        );
      }
    } catch (error) {
      console.error('Error fetching geo data:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input className="text-black" {...field} />
              </FormControl>
              <FormDescription className="text-white">Enter a zipcode</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
