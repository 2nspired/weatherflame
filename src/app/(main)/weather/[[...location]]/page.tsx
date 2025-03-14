// TODO: ADD A MORE CREATIVE WAY TO HANDLE NO RESULTS

import { api } from 'src/trpc/server';

import WeatherDisplay from '~/app/(main)/weather/_components/WeatherDisplay';

import WeatherHeader from '../_components/WeatherHeader';

const getGeoData = async (locationParam: string) => {
  if (!locationParam || locationParam.length === 0) {
    return null;
  }

  if (
    typeof locationParam === 'string' &&
    locationParam.length !== 0 &&
    isNaN(Number(locationParam))
  ) {
    const nameData = await api.location.getGeoByName({
      name: locationParam,
      countryCode: 'US',
    });
    return nameData?.[0] ?? null;
  }
};

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ location: string[] }>;
}) {
  const routeParams = await params;

  if (!routeParams.location || routeParams.location.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }
  const locationParam = decodeURIComponent(routeParams.location.slice(-1)[0] ?? '');

  if (!locationParam || locationParam.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }

  const geoData = await getGeoData(locationParam);

  return (
    <div className="flex size-full flex-col bg-zinc-200">
      {/* MAIN CONTAINER */}
      <div className="z-10 flex size-full flex-col">
        {/* CONTENT */}
        <div className="flex size-full grow flex-col border-b border-black bg-zinc-700 text-slate-100">
          {geoData?.lat && geoData.lon ? (
            <WeatherDisplay
              lat={geoData.lat}
              lon={geoData.lon}
              locationName={geoData.name}
              locationState={geoData.state}
            />
          ) : (
            <div className="flex h-full flex-col">
              <WeatherHeader />
              <div className="mt-20 flex h-full flex-col items-center text-2xl">
                <div>Well, that’s awkward...</div>
                <div className="mt-4 w-[600px] text-center text-sm">
                  We couldn’t find your location. Maybe double-check your spelling, or did
                  you just make up a city?
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
