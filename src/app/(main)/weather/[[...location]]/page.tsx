// TODO: ADD A MORE CREATIVE WAY TO HANDLE NO RESULTS

import { api } from 'src/trpc/server';

import WeatherDisplay from '~/app/(main)/weather/_components/WeatherDisplay';

// import { stateAbv } from '~/utilities/formatters/stateAbv';

import WeatherHeader from '../_components/WeatherHeader';

const getGeoData = async ({ location, state }: { location: string; state: string }) => {
  if (!location || !state) {
    return null;
  }

  if (typeof location === 'string' && location.length !== 0 && isNaN(Number(location))) {
    const nameData = await api.location.getGeoByName({
      name: location,
      state: state,
      countryCode: 'US',
    });
    return nameData ?? null;
  }
};

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ location: string[] }>;
}) {
  const routeParams = await params;

  console.log('routeParams', routeParams);

  if (!routeParams.location || routeParams.location.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }
  const locationName = decodeURIComponent(routeParams.location.slice(-1)[0] ?? '');
  const locationState = decodeURIComponent(routeParams.location.slice(-2)[0] ?? '');
  console.log('locationState', locationState);
  console.log('locationName', locationName);

  if (!locationName || locationName.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }

  const geoData = (
    await getGeoData({ location: locationName, state: locationState })
  )?.[0];

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
