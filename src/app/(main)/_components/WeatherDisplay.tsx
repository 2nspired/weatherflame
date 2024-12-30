// TODO: ADD WEEKLY FORECAST 1 - 5 days
// TODO: ANIMATE ICONS - BASED ON CONDITION and COMPONENT INITIALIZATION - https://motion.dev/docs/react-quick-start
// TODO: CREATE TRPC ROUTE TO RETURN 'CURRENT WEATHER' OBJECT
// TODO: LOADING STATES and ERROR HANDLING
// TODO: RESPONSIVE LAYOUTS - ADD ADDITIONAL INFORMATION: HOURLY FORECASTS

'use client';

import { CloudRain, Droplet, Wind } from 'lucide-react';

import { api } from '~/trpc/client';
import { formatAsLocalDate, formatDate } from '~/utilities/time/formatDate';

import SectionContainer from './SectionContainer';

export default function WeatherDisplay({
  lat,
  lon,
  locationName,
}: {
  lat: number;
  lon: number;
  locationName: string;
}) {
  const weatherData = api.weather.getAllWeather.useQuery({
    lat: lat.toString(),
    lon: lon.toString(),
  });

  console.log('WEATHER DATA', weatherData.data);

  const weeklyForecast =
    weatherData.data?.weeklyForecast &&
    weatherData.data.weeklyForecast.length !== 0 &&
    weatherData.data.weeklyForecast;

  const hourlyForecast =
    weatherData.data?.hourlyForecast &&
    weatherData.data.hourlyForecast.length !== 0 &&
    weatherData.data.hourlyForecast;

  if (!weeklyForecast || !hourlyForecast) {
    return <div>...error loading data</div>;
  }

  const currentWeather = {
    date:
      (hourlyForecast[0]?.startTime && formatDate(hourlyForecast[0]?.startTime)) ??
      formatAsLocalDate(new Date()),
    shortForecast: hourlyForecast[0]?.shortForecast ?? 'No forecast available',
    longForecast: weeklyForecast[0]?.detailedForecast ?? 'No forecast available',
    temperature:
      typeof hourlyForecast[0]?.temperature === 'number'
        ? hourlyForecast[0]?.temperature
        : hourlyForecast[0]?.temperature?.value,
    windSpeed:
      typeof hourlyForecast[0]?.windSpeed === 'string'
        ? hourlyForecast[0]?.windSpeed
        : null,
    windDirection: hourlyForecast[0]?.windDirection ?? null,
    humidity: hourlyForecast[0]?.relativeHumidity?.value ?? null,
    rainChance: hourlyForecast[0]?.probabilityOfPrecipitation?.value ?? null,
  };

  hourlyForecast[0];
  console.log('CURRENT WEATHER', currentWeather);

  console.log('WEATHER DATA', weatherData.data);

  return (
    <div className="flex h-full max-w-full flex-col items-center">
      <SectionContainer className="mt-3 border-t border-black">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-row text-lg font-bold">
            <div className="w-2/3 border-r border-black px-3 py-6">
              <div>{locationName}</div>
            </div>
            <div className="flex w-1/3 flex-row items-center justify-center">
              <div className="text-xs font-normal">{currentWeather.date}</div>
            </div>
          </div>

          {currentWeather.shortForecast && (
            <div className="w-full border-t border-black p-3 text-center">
              {currentWeather.shortForecast}
            </div>
          )}
        </div>
      </SectionContainer>
      <SectionContainer className="flex grow flex-col items-center justify-center">
        {currentWeather.temperature && (
          <div className="flex h-full w-full flex-row items-center justify-center border-t border-black px-3 py-8">
            <div className="font-mono text-[9rem] leading-none">
              {currentWeather.temperature}
            </div>
            <div className="flex flex-col justify-start text-[7rem] font-light leading-none">
              °
            </div>
          </div>
        )}
      </SectionContainer>
      <SectionContainer className="border-y border-black">
        <div className="flex flex-col space-y-3">
          <div className="px-3 pt-6 font-semibold">Daily Summary</div>
          <div className="px-3 pb-6">{currentWeather.longForecast}</div>
        </div>
      </SectionContainer>
      <SectionContainer className="">
        <div className="flex flex-row justify-evenly">
          {currentWeather.windSpeed && (
            <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-6">
              <div className="pb-3">
                <Wind size={36} />
              </div>
              <div>
                {currentWeather.windSpeed} {currentWeather.windDirection}
              </div>
              <div className="text-xs">Wind</div>
            </div>
          )}
          {currentWeather.humidity && (
            <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
              <div className="pb-3">
                <Droplet size={36} />
              </div>
              {currentWeather.humidity}%<div className="text-xs">Humidity</div>
            </div>
          )}
          {currentWeather.rainChance && (
            <div className="flex w-1/3 flex-col items-center justify-center py-3">
              <div className="pb-3">
                <CloudRain size={36} />
              </div>
              <div>{currentWeather.rainChance}%</div>
              <div className="text-xs">Rain</div>
            </div>
          )}
        </div>
      </SectionContainer>

      {/* <SectionContainer className="border-b border-black bg-red-500/50">
        <div>
          <div className="">[Weekly Forecast]</div>
        </div>
      </SectionContainer> */}
    </div>
  );
}
