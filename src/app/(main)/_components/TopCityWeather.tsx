'use client';

import Link from 'next/link';

import WeatherIcon from '~/app/(main)/weather/_components/WeatherIcons';
import { api } from '~/trpc/client';
import { stateAbv } from '~/utilities/formatters/stateAbv';

export default function TopCityWeather() {
  const topCitiesData = api.forecasts.getTopCityForecasts.useQuery(
    { limit: 8 },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );

  const topCitiesForecasts = topCitiesData.data;

  if (topCitiesForecasts && topCitiesForecasts.length !== 0) {
    return (
      <div className="animate-fade-in flex w-full flex-col items-center overflow-hidden border-b border-black text-white md:border-b-0">
        <div className="flex w-full flex-col md:grid md:max-w-full md:grid-cols-4 md:grid-rows-2">
          {topCitiesForecasts.map((city, index) => (
            <Link
              key={city?.city}
              href={`/weather/us/${encodeURIComponent(
                `${stateAbv(city?.state ?? '')}`,
              )}/${encodeURIComponent(`${city?.city}`)}`}
              className={` group relative grid w-full grid-cols-3 items-center justify-between overflow-hidden md:flex md:w-full md:flex-col md:space-y-3 md:border-b ${
                index !== 3 && index !== 7 ? 'md:border-r' : ''
              } md:border-black `}
            >
              <span
                className={`absolute inset-0 w-0 ${
                  ['bg-pink-500', 'bg-green-500', 'bg-purple-500'][index % 3]
                } transition-all duration-300 group-hover:w-full`}
              />
              <div className="relative z-10 col-start-1 col-end-2 flex flex-row p-3 pl-6 md:row-span-1 md:text-lg">
                <div className="sm:hidden">{`${city?.city}`}</div>
                <div className="hidden sm:flex">{`${city?.city}, ${stateAbv(city?.state ?? '')}`}</div>
              </div>
              <div className="relative z-10 col-start-2 col-end-3 flex justify-end p-3 font-mono md:row-span-2">
                <div className="hidden md:inline-block">
                  <WeatherIcon size={36} shortForecast={city?.shortForecast ?? ''} />
                </div>
                <div className="md:hidden">
                  <WeatherIcon size={24} shortForecast={city?.shortForecast ?? ''} />
                </div>
              </div>
              <div className="relative z-10 col-start-3 col-end-4 flex justify-end p-3 pr-6 font-mono md:row-span-3 md:pr-3 md:text-center md:text-xl">
                {city?.temperature}°
              </div>
            </Link>
          ))}
        </div>
        <div></div>
      </div>
    );
  }
}
