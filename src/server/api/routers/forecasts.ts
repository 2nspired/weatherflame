import createClient from 'openapi-fetch';
import { z } from 'zod';

import type { paths } from '~/app/types/weather-gov/weatherGov';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { formatDate } from '~/utilities/formatters/formatDate';
import { db } from '~/utilities/prisma';

// --------------------------------------------------------------
// TYPES

type FormattedForecast = {
  temperature: number | undefined;
  detailedForecast: string | undefined;
  shortForecast: string | undefined;
  windSpeed: string | undefined;
  windDirection:
    | 'N'
    | 'NNE'
    | 'NE'
    | 'ENE'
    | 'E'
    | 'ESE'
    | 'SE'
    | 'SSE'
    | 'S'
    | 'SSW'
    | 'SW'
    | 'WSW'
    | 'W'
    | 'WNW'
    | 'NW'
    | 'NNW'
    | undefined;
  humidity: number | undefined;
  rainChance: number | undefined;
};

export type WeeklyForecastChart = {
  date: string;
  day: FormattedForecast;
  night: FormattedForecast;
}[];

// --------------------------------------------------------------
const fetchClient = createClient<paths, 'application/geo+json'>({
  baseUrl: 'https://api.weather.gov',
  headers: {
    'User-Agent': 'weatherflame.com, thomastrudzinski@gmail.com',
    host: 'api.weather.gov',
    accept: 'application/geo+json',
  },
});

// --------------------------------------------------------------
// ROUTER

export const forecastRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET FORECAST STATION BY POINT
  // ----------------------------------------------------------

  getPointStation: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const { response, data, error } = await fetchClient.GET('/points/{point}', {
            params: {
              path: {
                point: `${input.lat.toString()},${input.lng.toString()}`,
              },
            },
          });

          if (response.ok && data?.properties) {
            // console.log('POINT WEATHER DATA RESPONSE', data);
            return data.properties;
          }

          if (error) {
            console.error('ERROR FETCHING FORECAST BY POINT:', error);
          }
          console.error(`FAILED TO FETCH FORECASE BY POINT, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING FORECAST BY POINT:', error);
        }
        attempts++;

        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getPointWeather');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
  // ----------------------------------------------------------
  // GET CURRENT WEATHER FORECAST
  // ----------------------------------------------------------

  getCurrentForecast: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const pointData = await getPointStation({
            lat: input.lat,
            lng: input.lng,
            maxRetries: input.maxRetries,
          });

          if (!pointData?.cwa || !pointData?.gridX || !pointData?.gridY) {
            console.error('Failed to get point data');
            return null;
          }

          const { response, data, error } = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast/hourly',
            {
              params: {
                path: {
                  wfo: pointData.cwa,
                  x: pointData.gridX,
                  y: pointData.gridY,
                },
              },
            },
          );

          if (response.ok && data?.properties?.periods?.[0]) {
            // console.log('HOURLY FORECAST RESPONSE', data.properties.periods);
            const forecast = data.properties.periods[0];

            const currentForecast = {
              startTime: forecast.startTime,
              temperature: forecast.temperature
                ? typeof forecast.temperature === 'number'
                  ? forecast.temperature
                  : (forecast.temperature?.value ?? undefined)
                : undefined,
              precipitation: forecast.probabilityOfPrecipitation
                ? typeof forecast.probabilityOfPrecipitation === 'number'
                  ? String(forecast.probabilityOfPrecipitation)
                  : (String(forecast.probabilityOfPrecipitation?.value) ?? undefined)
                : undefined,
              humidity: forecast.relativeHumidity
                ? typeof forecast.relativeHumidity === 'number'
                  ? forecast.relativeHumidity
                  : (forecast.relativeHumidity?.value ?? undefined)
                : undefined,
              dewpoint: forecast.dewpoint
                ? typeof forecast.dewpoint === 'number'
                  ? forecast.dewpoint
                  : (forecast.dewpoint?.value ?? undefined)
                : undefined,
              windSpeed: forecast.windSpeed
                ? typeof forecast.windSpeed === 'string'
                  ? forecast.windSpeed
                  : (String(forecast.windSpeed?.value) ?? undefined)
                : undefined,
              windDirection: forecast.windDirection,
              shortForecast: forecast.shortForecast,
            };

            return currentForecast;
          }
          if (error) {
            console.error('ERROR FETCHING HOURLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH HOURLY FORECAST, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING HOURLY FORECAST:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getHourlyForecast');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET HOURLY WEATHER FORECAST
  // ----------------------------------------------------------

  getHourlyForecast: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const pointData = await getPointStation({
            lat: input.lat,
            lng: input.lng,
            maxRetries: input.maxRetries,
          });

          if (!pointData?.cwa || !pointData?.gridX || !pointData?.gridY) {
            console.error('Failed to get point data');
            return null;
          }

          const { response, data, error } = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast/hourly',
            {
              params: {
                path: {
                  wfo: pointData.cwa,
                  x: pointData.gridX,
                  y: pointData.gridY,
                },
              },
            },
          );

          if (response.ok && data?.properties?.periods) {
            // console.log('HOURLY FORECAST RESPONSE', data.properties.periods);

            const hourlyForecast = data.properties.periods.map((period) => ({
              number: period.number,
              startTime: period.startTime,
              endTime: period.endTime,
              temperature: period.temperature
                ? typeof period.temperature === 'number'
                  ? period.temperature
                  : (period.temperature?.value ?? undefined)
                : undefined,
              precipitation: period.probabilityOfPrecipitation
                ? typeof period.probabilityOfPrecipitation === 'number'
                  ? period.probabilityOfPrecipitation
                  : (period.probabilityOfPrecipitation?.value ?? undefined)
                : undefined,
              humidity: period.relativeHumidity
                ? typeof period.relativeHumidity === 'number'
                  ? period.relativeHumidity
                  : (period.relativeHumidity?.value ?? undefined)
                : undefined,
              dewpoint: period.dewpoint
                ? typeof period.dewpoint === 'number'
                  ? period.dewpoint
                  : (period.dewpoint?.value ?? undefined)
                : undefined,
              windSpeed: period.windSpeed
                ? typeof period.windSpeed === 'string'
                  ? period.windSpeed
                  : typeof period.windSpeed.value === 'number'
                    ? String(period.windSpeed.value)
                    : undefined
                : undefined,
              windDirection: period.windDirection,
              shortForecast: period.shortForecast,
            }));

            return hourlyForecast;
          }
          if (error) {
            console.error('ERROR FETCHING HOURLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH HOURLY FORECAST, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING HOURLY FORECAST:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getHourlyForecast');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET WEEKLY WEATHER FORECAST
  // ----------------------------------------------------------

  getWeeklyForecast: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const pointData = await getPointStation({
            lat: input.lat,
            lng: input.lng,
            maxRetries: input.maxRetries,
          });

          if (!pointData?.cwa || !pointData?.gridX || !pointData?.gridY) {
            console.error('Failed to get point data');
            return null;
          }

          const { response, data, error } = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast',
            {
              params: {
                path: {
                  wfo: pointData.cwa,
                  x: pointData.gridX,
                  y: pointData.gridY,
                },
                query: {
                  units: 'us',
                },
              },
            },
          );

          if (response.ok && data?.properties?.periods) {
            // console.log('WEEKLY FORECAST RESPONSE', data.properties.periods);

            const daytimeForecasts = data.properties.periods.filter(
              (forecast) => forecast.isDaytime,
            );
            const nighttimeForecasts = data.properties.periods.filter(
              (forecast) => !forecast.isDaytime,
            );

            const pairedForecasts = daytimeForecasts.map((day) => {
              const matchingNight = nighttimeForecasts.find(
                (night) => night.startTime === day.endTime,
              );

              return { day: day, night: matchingNight ?? null };
            });

            const averageTemps = () => {
              const highTemps = pairedForecasts.map((forecast) => {
                return typeof forecast.day.temperature === 'number'
                  ? forecast.day.temperature
                  : (forecast.day.temperature?.value ?? 0);
              });

              const lowTemps = pairedForecasts.map((forecast) => {
                return typeof forecast.night?.temperature === 'number'
                  ? forecast.night.temperature
                  : (forecast.night?.temperature?.value ?? 0);
              });

              function averageTemp(temps: number[]): number {
                const validTemps = temps.filter((temp) => temp !== 0);
                const sum = validTemps.reduce((acc, temp) => acc + temp, 0);
                return validTemps.length ? sum / validTemps.length : 0;
              }

              return {
                high: Math.round(averageTemp(highTemps)),
                low: Math.round(averageTemp(lowTemps)),
              };
            };

            const averageTempValues = averageTemps();

            const weeklyForecast = pairedForecasts.map((forecast) => {
              const date = forecast.day.startTime
                ? formatDate(forecast.day.startTime)
                : '';

              return {
                date: date,
                day: {
                  name: forecast.day.name,
                  startTime: forecast.day.startTime,
                  endTime: forecast.day.endTime,
                  number: forecast.day.number,
                  temperature:
                    typeof forecast.day.temperature === 'number'
                      ? forecast.day.temperature === 0
                        ? averageTempValues.high
                        : forecast.day.temperature
                      : forecast.day.temperature?.value === 0
                        ? averageTempValues.high
                        : (forecast.day.temperature?.value ?? undefined),
                  detailedForecast: forecast.day.detailedForecast,
                  shortForecast: forecast.day.shortForecast,
                  // WINDSPEED - API DOCS STATE: "Wind speed for the period. This property as an string value is deprecated. Future versions will express this value as a quantitative value object. To make use of the future standard format now, set the "forecast_wind_speed_qv" feature flag on the request. HOWEVER, the API does not return the "forecast_wind_speed_qv" feature flag and only returns a string.
                  windSpeed:
                    typeof forecast.day.windSpeed === 'string'
                      ? forecast.day.windSpeed
                      : typeof forecast.day.windSpeed?.value === 'number'
                        ? String(forecast.day.windSpeed.value)
                        : undefined,
                  windDirection: forecast.day.windDirection,
                  humidity: forecast.day.relativeHumidity?.value ?? undefined,
                  rainChance: forecast.day.probabilityOfPrecipitation?.value ?? undefined,
                },
                night: forecast.night
                  ? {
                      number: forecast.night.number,
                      name: forecast.night.name,
                      startTime: forecast.night.startTime,
                      endTime: forecast.night.endTime,
                      temperature:
                        typeof forecast.night?.temperature === 'number'
                          ? forecast.night.temperature === 0
                            ? averageTempValues.low
                            : forecast.night.temperature
                          : forecast.night?.temperature?.value === 0
                            ? averageTempValues.low
                            : (forecast.night?.temperature?.value ?? undefined),
                      detailedForecast: forecast.night?.detailedForecast,
                      shortForecast: forecast.night?.shortForecast,
                      // SEE WINDSPEED NOTE ABOVE
                      windSpeed:
                        typeof forecast.night.windSpeed === 'string'
                          ? forecast.night.windSpeed
                          : typeof forecast.night.windSpeed?.value === 'number'
                            ? String(forecast.night.windSpeed.value)
                            : undefined,
                      windDirection: forecast.night?.windDirection,
                      humidity: forecast.night?.relativeHumidity?.value ?? undefined,
                      rainChance:
                        forecast.night?.probabilityOfPrecipitation?.value ?? undefined,
                    }
                  : {
                      temperature: averageTempValues.low,
                      detailedForecast: undefined,
                      shortForecast: undefined,
                      windSpeed: undefined,
                      windDirection: undefined,
                      humidity: undefined,
                      rainChance: undefined,
                    },
              };
            });
            return weeklyForecast;
          }

          if (error) {
            console.error('ERROR FETCHING WEEKLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH WEEKLY FORECAST, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING WEEKLY FORECAST:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getForecast');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET TOP CITY FORECASTS
  // ----------------------------------------------------------
  getTopCityForecasts: publicProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1, { message: 'Must be greater than 0' })
          .max(10, { message: 'Must be less than 10' }),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;
      while (attempts < 3) {
        try {
          const topCities = await db.cities.findMany({
            where: {
              display: true,
            },
            orderBy: {
              id: 'asc',
            },
            take: input.limit,
          });

          if (!topCities || topCities.length === 0) {
            console.error('Failed to get top cities');
            return null;
          }

          const forecasts = await Promise.all(
            topCities.map(async (city) => {
              const pointData = await getPointStation({
                lat: city.lat,
                lng: city.lng,
                maxRetries: 1,
              });

              if (!pointData?.cwa || !pointData?.gridX || !pointData?.gridY) {
                console.error('Failed to get point data', city.name);
                return null;
              }

              const { response, data, error } = await fetchClient.GET(
                '/gridpoints/{wfo}/{x},{y}/forecast/hourly',
                {
                  params: {
                    path: {
                      wfo: pointData.cwa,
                      x: pointData.gridX,
                      y: pointData.gridY,
                    },
                  },
                },
              );

              if (response.ok && data?.properties?.periods?.[0]) {
                // console.log('HOURLY FORECAST RESPONSE', data.properties.periods);
                const forecast = data.properties.periods[0];

                const currentForecast = {
                  city: city.name,
                  state: city.state,
                  country: city.country,
                  lat: city.lat,
                  lng: city.lng,
                  startTime: forecast.startTime,
                  temperature: forecast.temperature
                    ? typeof forecast.temperature === 'number'
                      ? forecast.temperature
                      : (forecast.temperature?.value ?? undefined)
                    : undefined,
                  precipitation: forecast.probabilityOfPrecipitation
                    ? typeof forecast.probabilityOfPrecipitation === 'number'
                      ? String(forecast.probabilityOfPrecipitation)
                      : (String(forecast.probabilityOfPrecipitation?.value) ?? undefined)
                    : undefined,
                  humidity: forecast.relativeHumidity
                    ? typeof forecast.relativeHumidity === 'number'
                      ? forecast.relativeHumidity
                      : (forecast.relativeHumidity?.value ?? undefined)
                    : undefined,
                  dewpoint: forecast.dewpoint
                    ? typeof forecast.dewpoint === 'number'
                      ? forecast.dewpoint
                      : (forecast.dewpoint?.value ?? undefined)
                    : undefined,
                  windSpeed: forecast.windSpeed
                    ? typeof forecast.windSpeed === 'string'
                      ? forecast.windSpeed
                      : (String(forecast.windSpeed?.value) ?? undefined)
                    : undefined,
                  windDirection: forecast.windDirection,
                  shortForecast: forecast.shortForecast,
                };

                return currentForecast;
              }
              if (error) {
                console.error('ERROR FETCHING TOP CITY FORECASTS', error);
              }
              console.error(
                `FAILED TO FETCH FORECASE BY POINT, ${response.status}, ${city.name}`,
              );
            }),
          );

          if (!forecasts || forecasts.length === 0) {
            console.error('FAIlED TO GET TOP CITY FORECASTS');
            return null;
          }
          return forecasts;
        } catch (error) {
          console.error('ERROR FETCHING TOP CITY FORECASTS', error);
        }
        attempts++;

        if (attempts >= 3) {
          console.error('MAX RETRIES REACHED: GET TOP CITY FORECASTS');
          return null;
        }
        console.warn(`Retrying (${attempts}/${3})`);
      }
    }),
});

// --------------------------------------------------------------
// --------------------------------------------------------------
// REUSED QUERY - CANNOT CALL a tRPC query/route from another tRPC query/route.
// --------------------------------------------------------------
// --------------------------------------------------------------
const getPointStation = async ({
  lat,
  lng,
  maxRetries = 1,
}: {
  lat: number;
  lng: number;
  maxRetries?: number;
}) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const { response, data, error } = await fetchClient.GET('/points/{point}', {
        params: {
          path: {
            point: `${lat.toString()},${lng.toString()}`,
          },
        },
      });

      if (response.ok && data?.properties) {
        const pointData = {
          cwa: data.properties.cwa,
          gridX: data.properties.gridX,
          gridY: data.properties.gridY,
        };

        // console.log('POINT WEATHER DATA RESPONSE', data);
        return pointData;
      }

      if (error) {
        console.error('ERROR FETCHING FORECAST BY POINT:', error);
      }
      console.error(`FAILED TO FETCH FORECASE BY POINT, ${response.status}`);
    } catch (error) {
      console.error('ERROR FETCHING FORECAST BY POINT:', error);
    }
    attempts++;

    if (attempts >= maxRetries) {
      console.error('MAX RETRIES REACHED: getPointWeather');
      return null;
    }
    console.warn(`Retrying (${attempts}/${maxRetries})`);
  }
  return null;
};
