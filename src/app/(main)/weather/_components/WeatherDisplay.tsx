// TODO: ANIMATE ICONS - BASED ON CONDITION and COMPONENT INITIALIZATION - https://motion.dev/docs/react-quick-start
// TODO: LOADING STATES and ERROR HANDLING

'use client';

import { CloudRain, Droplet, Wind } from 'lucide-react';

import AlertsDisplay from '~/app/(main)/_components/AlertsDisplay';
import WeatherHeader from '~/app/(main)/weather/_components/WeatherHeader';
import WeatherIcon from '~/app/(main)/weather/_components/WeatherIcons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { api } from '~/trpc/client';
import { abbreviateState } from '~/utilities/formatters/abbreviateState';
import {
  dateAddDays,
  formatDateHour,
  formatShortDate,
} from '~/utilities/formatters/formatDate';
import { isDev, isProd } from '~/utilities/platform';

import SectionContainer from '../../_components/SectionContainer';

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
  // ------------------------------------------------------------

  if (process.env.NODE_ENV === 'production') {
    console.log('ISDEV - expect false', isDev);
    console.log('ISPROD - expext true', isProd);
    console.log('NODE_ENV - expect prod', process.env.NODE_ENV);
    console.log('NEXT_PUBLIC_NODE_ENV - expect prod', process.env.NEXT_PUBLIC_NODE_ENV);
    console.log(
      'Is Development - expect false',
      process.env.NEXT_PUBLIC_NODE_ENV === 'development',
    );
    console.log(
      'Is Production - expect true',
      process.env.NEXT_PUBLIC_NODE_ENV === 'production',
    );
  }

  console.log('All Environment Variables:', process.env);

  // ------------------------------------------------------------

  const weatherData = api.weather.getAllWeather.useQuery(
    {
      lat: lat.toString(),
      lon: lon.toString(),
    },
    { enabled: true, refetchOnMount: false, refetchOnWindowFocus: false },
  );

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

  const randomIndex = Math.floor(Math.random() * 10);

  return (
    <div className="flex h-full max-w-full flex-col items-center">
      <WeatherHeader />
      {weatherData.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SectionContainer
            className={`${weatherData.data?.alertZones ? 'mt-0' : 'mt-3'} bg-zinc-200 text-black`}
          >
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-row">
                <div className="w-2/3 border-r border-black p-6 text-xl font-bold lg:px-6 lg:text-3xl">
                  <div>{`${locationName}, ${abbreviateState(locationState)}`}</div>
                </div>

                <div className="flex w-1/3 flex-row items-center justify-center">
                  {currentWeather?.date && (
                    <div className="text-xl lg:text-2xl" suppressHydrationWarning>
                      {currentWeather.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionContainer>
          {weatherData?.data?.alertZones && (
            <AlertsDisplay zones={weatherData.data.alertZones} />
          )}
          <SectionContainer className="border-t border-black bg-green-500">
            {currentWeather && (
              <div className="w-full p-3 text-center font-mono uppercase text-black lg:text-xl">
                {currentWeather.shortForecast}
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
                          {currentWeather.highTemperature && (
                            <div className="flex flex-row items-center space-x-2 text-lg">
                              <div className="font-semibold">Day:</div>
                              <div className="font-mono leading-none">
                                {currentWeather.highTemperature}°
                              </div>
                            </div>
                          )}
                          {currentWeather.lowTemperature && (
                            <div className="flex flex-row items-center space-x-2 text-lg">
                              <div className="font-semibold">Night:</div>
                              <div className="font-mono leading-none">
                                {currentWeather.lowTemperature}°
                              </div>
                            </div>
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
            {currentWeather?.longForecast && (
              <SectionContainer className="border-y border-black bg-zinc-200 text-black">
                <div className="flex flex-col space-y-3">
                  <div className="px-6 pt-6 font-semibold">Daily Summary</div>
                  <div className="px-6 pb-6">{currentWeather.longForecast}</div>
                </div>
              </SectionContainer>
            )}
            {currentWeather && (
              <SectionContainer className="bg-zinc-200 text-black">
                <div>
                  <div className="flex flex-row justify-evenly bg-zinc-100">
                    {currentWeather?.rainChance !== null &&
                      currentWeather?.rainChance !== undefined && (
                        <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                          <div className="pb-3">
                            <CloudRain size={36} />
                          </div>
                          <div className="font-mono">{currentWeather.rainChance}%</div>
                          <div className="text-xs">Rain</div>
                        </div>
                      )}
                    {currentWeather?.humidity !== null &&
                      currentWeather?.humidity !== undefined && (
                        <div className="flex w-1/3 flex-col items-center justify-center border-r border-black py-3">
                          <div className="pb-3">
                            <Droplet size={36} />
                          </div>
                          <div className="font-mono">{currentWeather.humidity}%</div>
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
          <SectionContainer className="border-t border-black bg-zinc-200 text-black lg:hidden">
            <div className="bg-zinc-100 px-10 py-6 text-center font-mono text-sm">
              <SassySeparator randomIndex={randomIndex} />
            </div>
          </SectionContainer>

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
                            : forecast.day.temperature?.value}
                          °
                        </div>
                        {forecast.night && (
                          <>
                            <div>/</div>
                            <div className="text-sm">
                              {typeof forecast.night?.temperature === 'number'
                                ? forecast.night.temperature
                                : forecast.night?.temperature?.value}
                              °
                            </div>
                          </>
                        )}
                      </div>

                      <div className="pt-2 text-sm">
                        {forecast.day.startTime
                          ? formatShortDate(forecast.day.startTime)
                          : currentWeather?.date &&
                            dateAddDays({
                              date: currentWeather.date,
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
                              {currentWeather.highTemperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Day:</div>
                                  <div className="font-mono leading-none">
                                    {currentWeather.highTemperature}°
                                  </div>
                                </div>
                              )}
                              {currentWeather.lowTemperature && (
                                <div className="flex flex-row items-center space-x-2 text-lg">
                                  <div className="font-semibold">Night:</div>
                                  <div className="font-mono leading-none">
                                    {currentWeather.lowTemperature}°
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
                      {currentWeather?.rainChance !== null &&
                        currentWeather?.rainChance !== undefined && (
                          <div className="flex w-full flex-row items-center justify-between space-x-6 py-3">
                            <div className="flex flex-row items-center space-x-3">
                              <CloudRain size={40} />
                              <div className="text-2xl">Rain</div>
                            </div>
                            <div className="font-mono text-xl">
                              {currentWeather.rainChance}%
                            </div>
                          </div>
                        )}
                      {currentWeather?.humidity !== null &&
                        currentWeather?.humidity !== undefined && (
                          <div className="flex w-full flex-row items-center justify-between space-x-10 py-3">
                            <div className="flex flex-row items-center space-x-3">
                              <Droplet size={40} />
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
            {currentWeather?.longForecast && (
              <SectionContainer className="border-y border-black bg-zinc-200 text-black">
                <div className="h-10"></div>
                <div className="flex flex-col space-y-3 border-y border-black bg-zinc-100">
                  <div className="px-6 pt-6 font-semibold lg:text-lg">Daily Summary</div>
                  <div className="px-6 pb-6">{currentWeather.longForecast}</div>
                </div>
                <div className="h-10"></div>
              </SectionContainer>
            )}
          </div>

          {/* DESKTOP: HOURLY & WEEKLY FORECASTS */}

          <SectionContainer className="hidden h-full bg-zinc-200 lg:flex">
            <div className="flex size-full flex-row">
              {/* <div className="flex size-full flex-row"> */}
              {/* <div className="w-8 border-r border-black"></div> */}

              {/* DESKTOP: HOURLY FORECAST */}

              {hourlyForecasts && (
                <div className="w-1/3 bg-pink-500 text-black">
                  <div className="border-r border-black p-6 text-xl font-semibold">
                    Hourly Forecast
                  </div>
                  <div className="flex flex-col justify-center">
                    {/* TODO: HOW DO I MAKE THE ROWS FILL THE CONTAINER */}
                    <Accordion
                      type="single"
                      collapsible
                      className="h-full border-r border-black"
                      defaultValue="index-1"
                    >
                      {hourlyForecasts.map((forecast, index) => (
                        <AccordionItem
                          key={forecast.number}
                          className={`border-b-0 px-3 hover:no-underline ${index === hourlyForecasts.length - 1 ? '' : 'border-b border-black '}`}
                          value={`index-${index + 1}`}
                        >
                          <AccordionTrigger className="px-3 hover:no-underline">
                            <div className="grid w-full grid-cols-3 gap-3">
                              <div className="col-start-1 col-end-1 text-left text-xl">
                                {forecast.startTime && formatDateHour(forecast.startTime)}
                              </div>
                              {forecast.shortForecast && (
                                <div className="col-start-2 col-end-2">
                                  <WeatherIcon
                                    shortForecast={forecast.shortForecast}
                                    size={36}
                                  />
                                </div>
                              )}

                              <div className="col-start-3 col-end-3 flex font-mono text-xl">
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
                            {forecast.shortForecast && (
                              <div className="col-span-3 col-end-3 flex flex-row space-x-2 pt-3">
                                <div className="font-semibold">Forecast:</div>
                                <div>{forecast.shortForecast}</div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              )}

              {/* DESKTOP: WEEKLY FORECASTS */}
              {weeklyForecasts && (
                <div className="flex h-full w-2/3 flex-col bg-orange-500 text-black">
                  <div className="p-6 text-xl font-semibold">7-Day Forecast</div>
                  <div className="flex h-full flex-col pt-3 text-black">
                    {weeklyForecasts?.map((forecast, index) => (
                      <div
                        key={forecast.day.number}
                        className="grid grow grid-cols-9 px-6"
                      >
                        <div className="col-span-2 col-start-1 flex flex-col">
                          {forecast.day.name && (
                            <div className="text-2xl">{forecast.day.name}</div>
                          )}
                          <div>
                            {forecast.day.startTime
                              ? formatShortDate(forecast.day.startTime)
                              : currentWeather?.date &&
                                dateAddDays({
                                  date: currentWeather.date,
                                  days: index === 0 ? 1 : index,
                                })}
                          </div>
                        </div>
                        <div className="col-start-3 col-end-3 font-mono">
                          <div className="text-2xl">
                            {typeof forecast.day.temperature === 'number'
                              ? forecast.day.temperature
                              : forecast.day.temperature?.value}
                            °
                          </div>
                          {forecast.night && (
                            <div className="text-xl">
                              {typeof forecast.night.temperature === 'number'
                                ? forecast.night.temperature
                                : forecast.night.temperature?.value}
                              °
                            </div>
                          )}
                        </div>
                        {forecast.day.shortForecast && (
                          <div className="col-start-4 col-end-5 flex h-full items-start pt-2">
                            <WeatherIcon
                              shortForecast={forecast.day.shortForecast}
                              size={36}
                            />
                          </div>
                        )}
                        {forecast.day.detailedForecast && (
                          <div className="col-span-6 col-start-5">
                            {forecast.day.detailedForecast}
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
const SassySeparator = ({ randomIndex }: { randomIndex: number }) => {
  const sayings = [
    'Short-term drama up top, long-term speculation below.',
    'Hourly: for the impatient. Weekly: for the planners.',
    'If the next hour isn’t looking good, check below for some hope.',
    'Because predicting the future is hard enough without weather.',
    'Up there: weather gossip. Down here: weather novels.',
    'Hourly updates: the TikTok of weather. Weekly: the Netflix binge.',
    'For those living in the moment, stay up here. For dreamers, keep scrolling.',
    'Hourly forecast: reality. Weekly forecast: optimism.',
    'One’s for now, one’s for later. Either way, bring a jacket just in case.',
    'Hourly: the tea. Weekly: the prophecy.',
  ];
  return sayings[randomIndex];
};
