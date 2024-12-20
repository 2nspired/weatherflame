import createClient from 'openapi-fetch';
import { z } from 'zod';

import { weatherForecastOffices } from '~/app/types/weather-gov/weatherForecastOffices';
import type { components, paths } from '~/app/types/weather-gov/weatherGov';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// --------------------------------------------------------------
// TYPES

type ForecastPeriods = components['schemas']['GridpointForecast']['periods'];

type AllWeather = {
  weeklyForecast: ForecastPeriods | null;
  hourlyForecast: ForecastPeriods | null;
};

// --------------------------------------------------------------
const fetchClient = createClient<paths, 'application/geo+json'>({
  baseUrl: 'https://api.weather.gov',
  headers: {
    'User-Agent': 'weatherflame.com, thomastrudzinski@gmail.com',
    host: 'api.weather.gov',
    accept: 'application/geo+json',
  },
});

export const weatherRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET WEATHER FORECAST BY POINT
  // ----------------------------------------------------------

  getPointWeather: publicProcedure
    .input(
      z.object({
        point: z.string(),
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
                point: input.point,
              },
            },
          });

          if (response.ok && data && data.properties) {
            console.log('POINT WEATHER DATA RESPONSE', data);
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
  // GET WEEKLY WEATHER FORECAST
  // ----------------------------------------------------------

  getWeeklyForecast: publicProcedure
    .input(
      z.object({
        wfo: weatherForecastOffices,
        gridX: z.number(),
        gridY: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const { response, data, error } = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast',
            {
              params: {
                path: {
                  wfo: input.wfo,
                  x: input.gridX,
                  y: input.gridY,
                },
                query: {
                  units: 'us',
                },
              },
            },
          );

          if (response.ok && data?.properties?.periods) {
            console.log('WEEKLY FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
          }
          if (error) {
            console.error('ERROR FETCHING WEEKLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH WEEKLY FORECASE, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING FORECAST:', error);
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
  // GET HOURLY WEATHER FORECAST
  // ----------------------------------------------------------

  getHourlyForecast: publicProcedure
    .input(
      z.object({
        wfo: weatherForecastOffices,
        gridX: z.number(),
        gridY: z.number(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const { response, data, error } = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast/hourly',
            {
              params: {
                path: {
                  wfo: input.wfo,
                  x: input.gridX,
                  y: input.gridY,
                },
              },
            },
          );

          if (
            response.ok &&
            data?.properties?.periods &&
            data.properties.periods.length > 0
          ) {
            console.log('HOURLY FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
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
  // GET COMPLETE WEATHER FORECAST BY POINT
  // ----------------------------------------------------------

  getAllWeather: publicProcedure
    .input(
      z.object({
        lat: z.string({ message: 'Latitude is required' }).regex(/^(-?\d+(\.\d+)?)/),
        lon: z.string({ message: 'Longitude is required' }).regex(/^(-?\d+(\.\d+)?)/),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let weeklyForecast = null;
      let hourlyForecast = null;

      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const pointData = await fetchClient.GET('/points/{point}', {
            params: {
              path: {
                point: `${input.lat},${input.lon}`,
              },
            },
          });

          if (pointData.response.ok && pointData.data && pointData.data.properties) {
            console.log('POINT DATA RESPONSE', pointData.data);

            const { cwa, gridX, gridY } = pointData.data.properties;

            if (cwa && gridX && gridY) {
              if (weatherForecastOffices.safeParse(cwa).success) {
                [weeklyForecast, hourlyForecast] = await Promise.all([
                  fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast', {
                    params: {
                      path: {
                        wfo: cwa,
                        x: gridX,
                        y: gridY,
                      },
                    },
                  }),
                  fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast/hourly', {
                    params: {
                      path: {
                        wfo: cwa,
                        x: gridX,
                        y: gridY,
                      },
                    },
                  }),
                ]);
              } else {
                const parsedCwa = weatherForecastOffices.safeParse(cwa);
                if (parsedCwa.success) {
                  [weeklyForecast, hourlyForecast] = await Promise.all([
                    fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast', {
                      params: {
                        path: {
                          wfo: cwa,
                          x: gridX,
                          y: gridY,
                        },
                      },
                    }),
                    fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast/hourly', {
                      params: {
                        path: {
                          wfo: cwa,
                          x: gridX,
                          y: gridY,
                        },
                      },
                    }),
                  ]);
                } else {
                  console.error('Invalid CWA:', cwa);
                }
              }
            }
          }

          const forecast: AllWeather = { weeklyForecast: null, hourlyForecast: null };

          if (
            weeklyForecast?.response.ok &&
            weeklyForecast?.data?.properties?.periods &&
            weeklyForecast?.data?.properties?.periods.length > 0
          ) {
            forecast.weeklyForecast = weeklyForecast.data.properties.periods;
          } else {
            console.error('FAILED TO FETCH WEEKLY FORECAST:', weeklyForecast?.error);
          }

          if (
            hourlyForecast?.response.ok &&
            hourlyForecast?.data?.properties?.periods &&
            hourlyForecast?.data?.properties?.periods.length > 0
          ) {
            forecast.hourlyForecast = hourlyForecast.data.properties.periods;
          } else {
            console.error('FAILED TO FETCH HOURLY FORECAST:', hourlyForecast?.error);
          }

          if (forecast.weeklyForecast || forecast.hourlyForecast) {
            console.log('ALL WEATHER DATA RESPONSE', forecast);
            return forecast;
          }
        } catch (error) {
          console.error('ERROR FETCHING WEATHER:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getAllWeather');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
});
