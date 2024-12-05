'use client';

// TODO: DETERMINE ZOD ISSUES
import { redirect } from 'next/navigation';
import { useState } from 'react';

import { Button } from '~/app/main/_components/shadcn/button';
import { Input } from '~/app/main/_components/shadcn/input';
import { api } from '~/trpc/client';

// ------------------------------------------------------------

export default function Landing() {
  const [zipcode, setZipcode] = useState<string>('96815');
  console.log('zipcode', zipcode);

  const [submitZipcode, setSubmitZipcode] = useState<string>(zipcode);
  console.log('submitZipcode', submitZipcode);

  const trpcGetGeoByZip = api.location.getGeoByZip.useQuery(
    {
      zip: submitZipcode,
      countryCode: 'US',
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const handleSubmit = () => {
    console.log('zipcode', zipcode);
    setSubmitZipcode(zipcode);
    console.log('submitZipcode', submitZipcode);
    // const getGeoByZip = api.location.getGeoByZip.useQuery({
    //   zip: '90210',
    //   countryCode: 'US',
    // });
    // console.log(
    //   'LANDING COMPONENT RETURN ------------->>>>>>>>>> getGeoByZip',
    //   getGeoByZip,
    // );

    if (trpcGetGeoByZip.data?.lat && trpcGetGeoByZip.data?.lon) {
      console.log(
        'getGeoByZip.data?.lat',
        trpcGetGeoByZip.data?.lat,
        'getGeoByZip.data?.lat',
        trpcGetGeoByZip.data?.lat,
      );
      redirect(
        `/main/alerts/lat=${'getGeoByZip.data?.lat'}&lon=${'getGeoByZip.data?.lon'}`,
      );
    }
  };

  return (
    <>
      <div className="items- flex flex-row">
        <div className="px-6 pb-4 pt-6 text-5xl md:text-6xl ">weatherflame</div>
      </div>
      <div>
        {trpcGetGeoByZip.isLoading
          ? 'loading...'
          : `lat: ${JSON.stringify(trpcGetGeoByZip.data?.lat)}, lon: ${JSON.stringify(trpcGetGeoByZip.data?.lon)}`}
      </div>
      <Input
        placeholder="Zipcode"
        type="number"
        className="w-32 text-sm text-black"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />

      <Button onClick={handleSubmit} type="submit">
        <button>Submit</button>
      </Button>
    </>
  );
}
