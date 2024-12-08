'use client';

// TODO: Add zod error handling and return messages
// TODO: Setup to handle geoByName
// TODO: Add error handling for invalid zipcodes
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '~/app/main/_components/shadcn/button';
import { Input } from '~/app/main/_components/shadcn/input';
import { type WeatherApiResponse } from '~/app/types/weather-gov/locationTypes';
import { api } from '~/trpc/client';

// ------------------------------------------------------------

// TODO: REMOVE UNUSED SEARCH PARAMS

export default function InputLocation2() {
  const [zipcode, setZipcode] = useState<string>('');
  const fetchGeoByZip = api.location.getGeoByZip.useMutation();
  const fetchZoneByGeo = api.location.getZoneByGeo.useMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const geoData = await fetchGeoByZip.mutateAsync({
        zip: zipcode,
        countryCode: 'US',
      });

      if (geoData) {
        const searchParams = new URLSearchParams();
        searchParams.append('lat', geoData.lat.toString());
        searchParams.append('lon', geoData.lon.toString());
        searchParams.append('name', geoData.name);
        searchParams.append('state', geoData.state);
        searchParams.append('country', geoData.country);
        searchParams.append('zip', zipcode);
        searchParams.append('zonetest', 'CAZ250');

        const zoneData: WeatherApiResponse = await fetchZoneByGeo.mutateAsync({
          lat: geoData.lat.toString(),
          lon: geoData.lon.toString(),
        });

        if (zoneData) {
          zoneData.features.forEach((zone) => {
            searchParams.append(`${zone.properties.type}`, zone.properties.id);
            console.log('zoneData:', searchParams);
          });

          router.push(`/experiments/alerts?${searchParams}`);
        }
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
