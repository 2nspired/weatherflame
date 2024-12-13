'use client';

// TODO: Add zod error handling and return messages
// TODO: Setup to handle geoByName
// TODO: Add error handling for invalid zipcodes
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '~/app/main/_components/shadcn/button';
import { Input } from '~/app/main/_components/shadcn/input';
import { api } from '~/trpc/client';
import { abbreviateState } from '~/utilities/abbreviateState';

// ------------------------------------------------------------

export default function InputLocation() {
  const [zipcode, setZipcode] = useState<string>('96815');

  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchGeoByName = api.location.getGeoByName.useMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const zipData = await fetchGeoByZip.mutateAsync({
        zip: zipcode,
        countryCode: 'US',
      });

      const nameData = await fetchGeoByName.mutateAsync({
        name: zipData.name,
        countryCode: zipData.country,
      });

      const state = nameData[0] ? abbreviateState(nameData[0].state) : '';

      if (zipData && state) {
        router.push(
          `/main/weather/alerts/${zipData.country}/${state}/${zipData.name}/${zipcode}`,
        );
      }
    } catch (error) {
      console.error('Error fetching geo coordinates:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <Input
        placeholder="Zipcode"
        type="number"
        className="w-32 text-sm text-black"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />
      <Button className="w-20" onClick={handleSubmit} type="submit">
        Submit
      </Button>
    </div>
  );
}
