'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

export default function InputTest({ className }: { className?: string }) {
  const fetchZipTest = api.experiments.getZipTest.useMutation();

  const zodClientSchema = z.object({
    zip: z
      .string()
      .nonempty('client: Please enter a name')
      .max(4, 'client: Zip code must be less than 4 characters'),
  });

  const form = useForm<z.infer<typeof zodClientSchema>>({
    resolver: zodResolver(zodClientSchema),
    defaultValues: {
      zip: '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<z.infer<typeof zodClientSchema>> = async (data) => {
    console.log('SUBMIT DATA', data);
    await fetchZipTest.mutateAsync(data);
    console.log('FETCH ZIP TEST', fetchZipTest.error);
  };

  return (
    <div>
      <div>INPUT TEST COMPONENT</div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormControl>
                    <Input
                      placeholder="zipcode or city"
                      className="w-40 text-sm text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* DISPLAY ERRORS */}
                  <div>
                    {fetchZipTest.error?.data?.zodError?.fieldErrors.zip && (
                      <div className="text-blue-500">
                        {fetchZipTest.error.data.zodError.fieldErrors.zip}
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
