'use client';

import { CloudRain, Droplets, Wind } from 'lucide-react';

import SassySeparator from '~/app/(main)/_components/SassySeparator';
import AlertsDisplay from '~/app/(main)/weather/_components/AlertsDisplay';
import WeatherHeader from '~/app/(main)/weather/_components/WeatherHeader';
import WeatherIcon from '~/app/(main)/weather/_components/WeatherIcons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { api } from '~/trpc/client';
import {
  dateAddDays,
  formatDate,
  formatDateHour,
  formatShortDate,
} from '~/utilities/formatters/formatDate';
import { stateAbv } from '~/utilities/formatters/stateAbv';

import SectionContainer from '../../_components/SectionContainer';
import TypewriterText from '../../_components/TextAnimations';

export default function WeatherDisplay({
  lat,
  lon,
  locationName,
  locationState,
}: {
  lat: number;
  lon: number;
  locationName: string;
  locationState: string;
}) {
  const trpcProps = { lat: lat, lng: lon };
  const trpcSettings = {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  };

  const currentForecast = api.forecasts.getCurrentForecast.useQuery(
    trpcProps,
    trpcSettings,
  );

  const hourlyForecast = api.forecasts.getHourlyForecast.useQuery(
    trpcProps,
    trpcSettings,
  );

  const weeklyForecast = api.forecasts.getWeeklyForecast.useQuery(
    trpcProps,
    trpcSettings,
  );

  const alertZones = api.location.getZoneByGeo.useQuery(trpcProps, {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isLoading =
    currentForecast.isLoading ||
    hourlyForecast.isLoading ||
    weeklyForecast.isLoading ||
    alertZones.isLoading;

  const currentWeather = currentForecast.data;

  const shortHourlyForecasts = hourlyForecast.data
    ? hourlyForecast.data.slice(0, 4)
    : null;

  const shortWeeklyForecasts = weeklyForecast.data
    ? weeklyForecast.data.slice(0, 4)
    : null;

  const hourlyForecasts = hourlyForecast.data?.slice(0, 8);
  const weeklyForecasts = weeklyForecast.data;

  return (
    <div className="flex h-full max-w-full flex-col items-center">
      <WeatherHeader />
      {isLoading ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="rounded-lg border-2 border-zinc-100 text-zinc-100">
            <div className="px-6 py-1 font-mono text-3xl">
              <TypewriterText className="flex" text="loading">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-150">.</span>
                <span className="animate-pulse delay-300">.</span>
              </TypewriterText>
            </div>
          </div>
        </div>
      ) : (
        <>
          <SectionContainer
            className={`${alertZones ? 'mt-0' : 'mt-3'} bg-zinc-200 text-black`}
          >
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-row">
                <div className="w-2/3 border-r border-black p-6 text-xl font-bold lg:px-6 lg:text-3xl">
                  <div>{`${locationName}, ${stateAbv(locationState)}`}</div>
                </div>

                <div className="flex w-1/3 flex-row items-center justify-center">
                  {currentWeather?.startTime && (
                    <div className="text-xl lg:text-2xl" suppressHydrationWarning>
                      {formatDate(currentWeather?.startTime)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionContainer>
          <div className="w-full">
            {alertZones?.data && (
              <AlertsDisplay
                zones={alertZones.data.map((alert) => {
                  return alert.zone;
                })}
              />
            )}
          </div>
          <SectionContainer className="border-t border-black bg-green-500">
            {currentWeather && (
              <div className="w-full p-6 text-center font-mono uppercase text-black lg:text-xl">
                {currentWeather?.shortForecast}
              </div>
            )}
          </SectionContainer>
          {/* MOBILE: CURRENT TEMP */}
          {currentWeather && (
            <SectionContainer className="grow border-t border-black lg:hidden">
              <div className="flex size-full flex-col">
                {currentWeather.temperature !== null &&
                  currentWeather.temperature !== undefined && (
                    <div className="flex size-full flex-col items-center justify-center">
                      <div className="flex h-full flex-col justify-center p-6 py-10">
                        <div className="text-[10rem] leading-none">{`${currentWeather.temperature}°`}</div>
                        <div className="flex flex-row justify-between px-2">
                          {weeklyForecast?.data && (
                            <>
                              {weeklyForecast.data[0]?.day.temperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Day:</div>
                                  <div className="font-mono leading-none">
                                    {weeklyForecast.data[0]?.day.temperature}°
                                  </div>
                                </div>
                              )}
                              {weeklyForecast.data[0]?.night.temperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Night:</div>
                                  <div className="font-mono leading-none">
                                    {weeklyForecast.data[0]?.night.temperature}°
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </SectionContainer>
          )}
          {/* MOBILE: DAILY SUMMARY */}
          <div className="w-full lg:hidden">
            {weeklyForecast.data &&
              Array.isArray(weeklyForecast.data) &&
              weeklyForecast.data[0]?.day.detailedForecast && (
                <SectionContainer className="border-y border-black bg-zinc-200 text-black">
                  <div className="flex flex-col space-y-3">
                    <div className="px-6 pt-6 font-semibold">Daily Summary</div>
                    <div className="px-6 pb-6">
                      {weeklyForecast.data[0]?.day.detailedForecast}
                    </div>
                  </div>
                </SectionContainer>
              )}
            {currentForecast.data && (
              <SectionContainer className="bg-zinc-200 text-black">
                <div>
                  <div className="flex flex-row justify-evenly bg-zinc-100">
                    {currentForecast?.data?.precipitation !== null &&
                      currentForecast?.data.precipitation !== undefined && (
                        <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                          <div className="pb-3">
                            <CloudRain size={36} />
                          </div>
                          <div className="font-mono">
                            {currentForecast.data.precipitation}%
                          </div>
                          <div className="text-xs">Rain</div>
                        </div>
                      )}
                    {currentForecast?.data.humidity !== null &&
                      currentForecast?.data.humidity !== undefined && (
                        <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                          <div className="pb-3">
                            <Droplets size={36} />
                          </div>
                          <div className="font-mono">
                            {currentForecast?.data.humidity}%
                          </div>
                          <div className="text-xs">Humidity</div>
                        </div>
                      )}
                    {currentForecast?.data.windSpeed !== null &&
                      currentForecast?.data.windSpeed !== undefined && (
                        <div className="flex w-1/3 flex-col items-center justify-center py-6">
                          <div className="pb-3">
                            <Wind size={36} />
                          </div>
                          <div className="font-mono">
                            {currentForecast?.data.windSpeed}{' '}
                            {currentForecast?.data.windDirection}
                          </div>
                          <div className="text-xs">Wind</div>
                        </div>
                      )}
                  </div>
                  <div className="flex h-10 flex-row justify-evenly border-t border-black bg-zinc-200"></div>
                </div>
              </SectionContainer>
            )}
          </div>
          {/* MOBILE: HOURLY FORECASTS */}
          {shortHourlyForecasts && (
            <div className="w-full lg:hidden">
              <SectionContainer className="border-t border-black bg-pink-500 text-black">
                <div className="flex flex-row items-center justify-start">
                  <div className="p-6 font-semibold">Hourly Forecast</div>
                  <div className="py-6">{/* <MoveRight size={36} /> */}</div>
                </div>
              </SectionContainer>
              <SectionContainer className="border-t border-black bg-pink-500">
                <div className="text-black">
                  <Accordion type="single" collapsible>
                    {shortHourlyForecasts.map((forecast, index) => (
                      <AccordionItem
                        key={forecast.number}
                        className={'border-black px-3'}
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
                                : forecast.temperature}
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
                                <div className="font-mono">{forecast.precipitation}%</div>
                              </div>
                            </div>

                            <div className="col-start-2 col-end-2 flex flex-col space-y-2">
                              <div>Humidity</div>
                              <div className="flex w-20 flex-row space-x-3">
                                <Droplets size={24} />
                                <div className="font-mono">{forecast.humidity}%</div>
                              </div>
                            </div>
                            <div className="col-start-3 col-end-3 flex flex-col space-y-2">
                              <div>Wind</div>
                              <div className="flex w-32 flex-row">
                                <Wind size={24} />
                                <div className="pl-3 font-mono">
                                  {typeof forecast.windSpeed === 'string'
                                    ? forecast.windSpeed
                                    : forecast.windSpeed}{' '}
                                  {forecast.windDirection}
                                </div>
                              </div>
                            </div>
                            {forecast.shortForecast && (
                              <div className="col-span-full flex flex-row space-x-2 pt-3">
                                <div className="font-semibold">Forecast:</div>
                                <div>{forecast.shortForecast}</div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="h-10"></div>
              </SectionContainer>
            </div>
          )}
          {/* MOBILE: SASSY SEPARATOR */}
          <div className="w-full text-sm lg:hidden">
          <div className="w-full text-sm lg:hidden">
            <SassySeparator />
          </div>
          {/* MOBILE: WEEKLY FORECASTS */}
          {shortWeeklyForecasts && (
            <div className="w-full lg:hidden">
              <SectionContainer className="border-t border-black bg-orange-500 text-black">
                <div className="flex flex-row items-center justify-start">
                  <div className="p-6 font-semibold">Weekly Forecast</div>
                  {/* <div className="py-6">
            <MoveRight size={36} />
          </div> */}
                </div>
              </SectionContainer>
              <SectionContainer className="border-t border-black bg-orange-500 text-black">
                <div className="flex flex-row justify-evenly">
                  {shortWeeklyForecasts.map((forecast, index) => (
                    <div
                      key={forecast.day.number}
                      className={`flex w-full flex-col items-center py-8 ${
                        index !== shortWeeklyForecasts.length - 1
                          ? 'border-r border-black'
                          : ''
                      }`}
                    >
                      {forecast.day.shortForecast && (
                        <div className="flex flex-col items-center justify-center pb-3">
                          <WeatherIcon shortForecast={forecast.day.shortForecast} />
                        </div>
                      )}
                      <div className="flex flex-row items-center pb-2 text-lg">
                        <div className="font-mono">
                          {typeof forecast.day.temperature === 'number'
                            ? forecast.day.temperature
                            : forecast.day.temperature}
                          °
                        </div>
                        {forecast.night && (
                          <>
                            <div>/</div>
                            <div className="text-sm">
                              {typeof forecast.night?.temperature === 'number'
                                ? forecast.night.temperature
                                : forecast.night?.temperature}
                              °
                            </div>
                          </>
                        )}
                      </div>

                      <div className="pt-2 text-sm">
                        {forecast.day
                          ? formatShortDate(forecast.date)
                          : currentWeather?.startTime &&
                            dateAddDays({
                              date: currentWeather.startTime,
                              days: index === 0 ? 1 : index,
                            })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-10 border-t border-black"></div>
              </SectionContainer>
            </div>
          )}
          {/* DESKTOP */}
          {/* DESKTOP: CURRENT WEATHER */}
          <div className="hidden w-full lg:flex lg:grow lg:flex-row">
            {currentWeather && (
              <SectionContainer>
                <div className="flex size-full flex-row">
                  <div className="flex w-2/3 flex-col border-r border-black">
                    {currentWeather.temperature !== null &&
                      currentWeather.temperature !== undefined && (
                        <div className="flex size-full flex-col items-center justify-center">
                          <div className="flex h-full flex-col justify-center p-6">
                            <div className="text-[10rem] leading-none">{`${currentWeather.temperature}°`}</div>
                            <div className="flex flex-row justify-between px-2">
                              {weeklyForecasts?.[0]?.day?.temperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Day:</div>
                                  <div className="font-mono leading-none">
                                    {weeklyForecasts[0]?.day?.temperature}°
                                  </div>
                                </div>
                              )}
                              {weeklyForecasts?.[0]?.night?.temperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Night:</div>
                                  <div className="font-mono leading-none">
                                    {weeklyForecasts?.[0]?.night?.temperature}°
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="flex h-full w-1/3 flex-col items-center justify-center border-t border-black">
                    <div className="flex size-full grow flex-col space-y-6 p-6">
                      {currentWeather?.precipitation !== null &&
                        currentWeather?.precipitation !== undefined && (
                          <div className="flex w-full flex-row items-center justify-between space-x-6 py-3">
                            <div className="flex flex-row items-center space-x-3">
                              <CloudRain size={40} />
                              <div className="text-2xl">Rain</div>
                            </div>
                            <div className="font-mono text-xl">
                              {currentWeather.precipitation}%
                            </div>
                          </div>
                        )}
                      {currentWeather?.humidity !== null &&
                        currentWeather?.humidity !== undefined && (
                          <div className="flex w-full flex-row items-center justify-between space-x-10 py-3">
                            <div className="flex flex-row items-center space-x-3">
                              <Droplets size={40} />
                              <div className="text-2xl">Humidity</div>
                            </div>
                            <div className="font-mono text-xl">
                              {currentWeather.humidity}%
                            </div>
                          </div>
                        )}
                      {currentWeather?.windSpeed !== null &&
                        currentWeather?.windSpeed !== undefined && (
                          <div className="flex w-full flex-row items-center justify-between space-x-6 py-3">
                            <div className="flex flex-row items-center space-x-3">
                              <Wind size={40} />
                              <div className="text-2xl">Wind</div>
                            </div>
                            <div className="font-mono text-xl">
                              {currentWeather.windSpeed} {currentWeather.windDirection}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </SectionContainer>
            )}
          </div>
          <div className="hidden w-full lg:flex lg:flex-col">
            {weeklyForecast.data &&
              Array.isArray(weeklyForecast.data) &&
              weeklyForecast.data[0]?.day.detailedForecast && (
                <SectionContainer className="border-y border-black text-black">
                  <div className="bg-zinc-200">
                    <div className="h-10"></div>
                    <div className="flex flex-col space-y-3 border-y border-black bg-zinc-100">
                      <div className="px-6 pt-6 font-semibold lg:text-xl">
                        Daily Summary
                      </div>
                      <div className="px-6 pb-6">
                        {weeklyForecast.data[0]?.day.detailedForecast}
                      </div>
                    </div>
                    <div className="h-10"></div>
                  </div>
                </SectionContainer>
              )}
          </div>
          {/* DESKTOP: HOURLY & WEEKLY FORECASTS */}
          <SectionContainer className="hidden h-full bg-zinc-700 lg:flex">
            <div className="flex size-full flex-col">

              {/* DESKTOP: HOURLY FORECAST */}
              {hourlyForecasts && (
                <div className="text-black">
                  <div className="border-black bg-pink-500 p-6 text-xl font-semibold">
                    Hourly Forecast
                  </div>
                  <div className="grid grid-cols-8">
                    {hourlyForecasts.map((forecast, index) => (

                      <div
                        key={forecast.number}
                        className={`flex flex-col items-center justify-center pt-3 ${index !== 7 && 'border-r border-black'} bg-pink-500`}
                      >
                        <div className="mb-2 py-2 text-lg">
                          {forecast.startTime && formatDateHour(forecast.startTime)}
                        </div>
                        <div className="flex w-full flex-row items-center border-y border-black">
                          {forecast.shortForecast && (
                            <div className="flex w-1/2 flex-col items-center justify-center border-r border-black py-6">
                              <WeatherIcon
                                shortForecast={forecast.shortForecast}
                                size={36}
                              />
                            </div>
                          )}
                          <div className="flex w-1/2 flex-col items-center justify-center font-mono text-xl">
                            {forecast.temperature}°
                          </div>
                        </div>
                        <div className="flex w-full flex-col justify-center py-3">
                          <div className="flex flex-row items-center justify-around space-x-6 py-3 font-mono">
                            <CloudRain size={24} />
                            <div>{forecast.precipitation}%</div>
                          </div>
                          <div className="flex flex-row items-center justify-around space-x-6 py-3 font-mono">
                            <Droplets size={24} />
                            <div>{forecast.humidity}%</div>
                          </div>
                          <div className="flex flex-row items-center justify-around space-x-6 py-3 font-mono">
                            <Wind size={24} className="ml-3" />
                            <div>{forecast.windSpeed}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
          <div className="hidden w-full lg:flex lg:flex-col">
            <SassySeparator />
          </div>
          <SectionContainer className="hidden h-full border-t border-black bg-zinc-700 lg:flex">
            <div className="flex size-full flex-col">
              {/* DESKTOP: WEEKLY FORECASTS */}
              {weeklyForecasts && (
                <div className="flex h-full flex-col bg-orange-500 pb-6 text-black">
                  <div className="px-6 pt-6 text-xl font-semibold">Weekly Forecast</div>
                  <div className="grid h-full grid-rows-7 text-black">
                    {weeklyForecasts?.map((forecast, index) => (
                      <div
                        key={forecast.day.number}
                        className={`grid grow grid-cols-9 ${index !== 0 && 'border-t '} border-black p-6`}
                      >
                        <div className="col-span-2 col-start-1 flex flex-col justify-center">
                          {forecast.day.name && (
                            <div className="text-xl">{forecast.day.name}</div>
                          )}
                          <div>
                            {forecast.day.startTime
                              ? formatShortDate(forecast.day.startTime)
                              : hourlyForecast.data?.[0]?.startTime &&
                                dateAddDays({
                                  date: currentWeather?.startTime ?? '',
                                  days: index === 0 ? 1 : index,
                                })}
                          </div>
                        </div>
                        {forecast.day.shortForecast && (
                          <div className="col-start-3 col-end-3 flex h-full flex-col items-start justify-center">
                            <WeatherIcon
                              shortForecast={forecast.day.shortForecast}
                              size={36}
                            />
                          </div>
                        )}
                        <div className="col-start-4 col-end-5 flex flex-col justify-center font-mono">
                          <div className="text-center text-2xl">
                            {typeof forecast.day.temperature === 'number'
                              ? forecast.day.temperature
                              : forecast.day.temperature}
                            °
                          </div>
                          {forecast.night && (
                            <div className="text-center text-xl">
                              {typeof forecast.night.temperature === 'number'
                                ? forecast.night.temperature
                                : forecast.night.temperature}
                              °
                            </div>
                          )}
                        </div>

                        {forecast.day.detailedForecast && (
                          <div className="col-span-6 col-start-6 flex flex-col justify-center">
                            {forecast.day.shortForecast}
                            {/* {forecast.day.detailedForecast} */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
        </>
      )}
    </div>
  );
}
