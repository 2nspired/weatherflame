// TODO: ANIMATE ICONS - BASED ON CONDITION and COMPONENT INITIALIZATION - https://motion.dev/docs/react-quick-start
// TODO: ADD ARROWS TO INDICATE WIND DIRECTION
// TODO: CREATE TRPC ROUTE TO RETURN 'CURRENT WEATHER' OBJECT
// TODO: LOADING STATES and ERROR HANDLING
// TODO: RESPONSIVE LAYOUTS - ADD ADDITIONAL INFORMATION: HOURLY FORECASTS

'use client';

import { CloudRain, Droplet, Wind } from 'lucide-react';

import WeatherIcon from '~/app/(main)/_components/WeatherIcons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { api } from '~/trpc/client';
import {
  dateAddDays,
  formatAsLocalDate,
  formatDate,
  formatDateHour,
  formatShortDate,
} from '~/utilities/formatters/formatDate';

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

  if (weatherData.error) {
    return <div>Error: {weatherData.error.message}</div>;
  }

  const currentWeather = weatherData.data?.currentWeather;
  const shortHourlyForecasts = weatherData.data?.hourlyForecast
    ? weatherData.data.hourlyForecast.slice(0, 4)
    : null;

  const shortWeeklyForecasts = weatherData.data?.weeklyForecast
    ? weatherData.data.weeklyForecast.slice(0, 4)
    : null;

  const hourlyForecasts = weatherData.data?.hourlyForecast;
  const weeklyForecasts = weatherData.data?.weeklyForecast;

  return (
    <div className="flex h-full max-w-full flex-col items-center">
      <SectionContainer className="mt-3 border-t border-black">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-row text-lg font-bold">
            <div className="w-2/3 border-r border-black px-3 py-6">
              <div>{locationName}</div>
            </div>
            <div className="flex w-1/3 flex-row items-center justify-center">
              <div className="text-sm font-normal">
                {currentWeather?.date ?? formatAsLocalDate(new Date())}
              </div>
            </div>
          </div>

          {currentWeather && (
            <div className="w-full border-t border-black bg-green-500 p-3 text-center uppercase text-black">
              {currentWeather.shortForecast}
            </div>
          )}
        </div>
      </SectionContainer>
      {currentWeather && (
        <SectionContainer className="grow">
          {currentWeather.temperature !== null &&
            currentWeather.temperature !== undefined && (
              <div className="flex size-full flex-row items-center justify-center border-t border-black px-3 py-8">
                <div className="font-mono text-[9rem] leading-none">
                  {currentWeather.temperature}
                </div>
                <div className="flex flex-col justify-start text-[7rem] font-light leading-none">
                  °
                </div>
              </div>
            )}
        </SectionContainer>
      )}

      {currentWeather?.longForecast && (
        <SectionContainer className="border-y border-black bg-zinc-200 text-black">
          <div className="flex flex-col space-y-3">
            <div className="px-3 pt-6 font-semibold">Daily Summary</div>
            <div className="px-3 pb-6">{currentWeather.longForecast}</div>
          </div>
        </SectionContainer>
      )}

      <SectionContainer className="bg-zinc-200 text-black">
        <div>
          <div className="flex flex-row justify-evenly bg-zinc-100">
            {currentWeather?.rainChance && (
              <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                <div className="pb-3">
                  <CloudRain size={36} />
                </div>
                <div className="font-mono">{currentWeather.rainChance}%</div>
                <div className="text-xs">Rain</div>
              </div>
            )}
            {currentWeather?.humidity !== null && (
              <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                <div className="pb-3">
                  <Droplet size={36} />
                </div>
                <div className="font-mono">{currentWeather?.humidity}%</div>
                <div className="text-xs">Humidity</div>
              </div>
            )}
            {currentWeather?.windSpeed !== null &&
              currentWeather?.windSpeed !== undefined && (
                <div className="flex w-1/3 flex-col items-center justify-center py-6">
                  <div className="pb-3">
                    <Wind size={36} />
                  </div>
                  <div className="font-mono">
                    {currentWeather.windSpeed} {currentWeather.windDirection}
                  </div>
                  <div className="text-xs">Wind</div>
                </div>
              )}
          </div>
          <div className="flex h-10 flex-row justify-evenly border-t border-black bg-zinc-200"></div>
        </div>
      </SectionContainer>

      {/* TODO: ALIGN EXPANDED VALUES WITH ACCORDIAN SET VALUES */}
      <SectionContainer className="border-t border-black bg-pink-500 text-black">
        <div className="flex flex-row items-center justify-start">
          <div className="px-3 py-6 font-semibold">Hourly Forecast</div>
          <div className="py-6">{/* <MoveRight size={36} /> */}</div>
        </div>
      </SectionContainer>
      {shortHourlyForecasts && (
        <SectionContainer className="border-t border-black bg-pink-500">
          <div className="text-black">
            <Accordion type="single" collapsible>
              {shortHourlyForecasts.map((forecast, index) => (
                <AccordionItem
                  key={index}
                  className="border-black px-3 hover:no-underline"
                  value={`index-${index + 1}`}
                >
                  <AccordionTrigger className="px-3 hover:no-underline">
                    <div className="grid w-full grid-cols-3 gap-3">
                      <div className="col-start-1 col-end-1 text-left">
                        {forecast.startTime && formatDateHour(forecast.startTime)}
                      </div>
                      {forecast.shortForecast && (
                        <div className="col-start-2 col-end-2">
                          <WeatherIcon shortForecast={forecast.shortForecast} />
                        </div>
                      )}

                      <div className="col-start-3 col-end-3 flex font-mono">
                        {typeof forecast.temperature === 'number'
                          ? forecast.temperature
                          : forecast.temperature?.value}
                        <div>°</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-3 pr-6">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-start-1 col-end-1 flex flex-col space-y-2">
                        <div>Rain</div>
                        <div className="flex w-20 flex-row space-x-3">
                          <CloudRain size={24} />
                          <div className="font-mono">
                            {forecast.probabilityOfPrecipitation?.value}%
                          </div>
                        </div>
                      </div>

                      <div className="col-start-2 col-end-2 flex flex-col space-y-2">
                        <div>Humidity</div>
                        <div className="flex w-20 flex-row space-x-3">
                          <Droplet size={24} />
                          <div className="font-mono">
                            {forecast.relativeHumidity?.value}%
                          </div>
                        </div>
                      </div>

                      <div className="col-start-3 col-end-3 flex flex-col space-y-2">
                        <div>Wind</div>
                        <div className="flex w-32 flex-row">
                          <Wind size={24} />
                          <div className="pl-3 font-mono">
                            {typeof forecast.windSpeed === 'string'
                              ? forecast.windSpeed
                              : forecast.windSpeed?.value}{' '}
                            {forecast.windDirection}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="h-10"></div>
        </SectionContainer>
      )}

      <SectionContainer className="border-t border-black bg-zinc-200 text-black">
        <div className="flex flex-row items-center justify-start">
          <div className="px-3 py-6 font-semibold">Weekly Forecast</div>
          {/* <div className="py-6">
            <MoveRight size={36} />
          </div> */}
        </div>
      </SectionContainer>
      {shortWeeklyForecasts && (
        <SectionContainer className="border-t border-black bg-slate-200 text-black">
          <div className="flex flex-row justify-evenly bg-slate-100">
            {shortWeeklyForecasts.map((forecast, index) => (
              <div
                key={index}
                className={`flex w-full flex-col items-center py-8 ${
                  index !== shortWeeklyForecasts.length - 1 ? 'border-r border-black' : ''
                }`}
              >
                <div className="flex pb-2 text-lg">
                  <div className="font-mono">
                    {typeof forecast.temperature === 'number'
                      ? forecast.temperature
                      : forecast.temperature?.value}
                  </div>
                  <div>°</div>
                </div>
                {forecast.shortForecast && (
                  <div className="flex flex-col items-center justify-center text-xs">
                    <WeatherIcon shortForecast={forecast.shortForecast} />
                    {/* <div className="pt-2 text-center">{forecast.shortForecast}</div> */}
                  </div>
                )}
                <div className="pt-2 text-sm">
                  {forecast.startTime
                    ? formatShortDate(forecast.startTime)
                    : dateAddDays({
                        date: currentWeather?.date ?? new Date().toDateString(),
                        days: index === 0 ? 1 : index,
                      })}
                </div>
              </div>
            ))}
          </div>
          <div className="h-10 border-t border-black"></div>
        </SectionContainer>
      )}

      {/* <SectionContainer className="h-10 border-b border-black bg-slate-200"></SectionContainer> */}
    </div>
  );
}
