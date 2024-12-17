import createClient from 'openapi-fetch';
import { z } from 'zod';

import { weatherForecastOffices } from '~/app/types/weather-gov/weatherForecastOffices';
import type { paths } from '~/app/types/weather-gov/weatherGov';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
            console.log('POINT DATA', data);
            return data.properties;
          }

          if (error) {
            console.error('Error fetching forecast:', error);
          }
          console.error(`Failed to fetch point weather, ${response.status}`);
        } catch (error) {
          console.error('Error fetching point weather:', error);
        }
        attempts++;

        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getPointWeather');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

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
            console.log('FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
          }
          if (error) {
            console.error('Error fetching forecast:', error);
          }
          console.error(`Failed to fetch forecast, ${response.status}`);
        } catch (error) {
          console.error('Error fetching forecast:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getForecast');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

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

          if (response.status === 200 && data?.properties?.periods) {
            console.log('HOURLY FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
          }
          if (error) {
            console.error('ERROR FETCHING HOURLY FORECAST:', error);
          }
          console.error(`Failed to fetch hourly forecast, ${response.status}`);
        } catch (error) {
          console.error('Error fetching hourly forecast:', error);
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
  // TODO: CONSOLIDATE BASED ON THE INDIVIDUAL CALLS, RETURN A SINGLE OBJECT WITH EVERYTHING NEEDED.
  //
  // GET WEATHER FORECAST BY POINT
  // ----------------------------------------------------------

  getWeatherByPoint: publicProcedure
    .input(
      z.object({
        point: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const pointData = await fetchClient.GET('/points/{point}', {
          params: {
            path: {
              point: input.point,
            },
          },
        });

        if (
          pointData.response.status === 200 &&
          pointData.data?.properties?.forecast &&
          pointData?.data?.properties?.gridId &&
          pointData?.data?.properties?.gridX &&
          pointData?.data?.properties?.gridY
        ) {
          const forecastData = await fetchClient.GET(
            '/gridpoints/{wfo}/{x},{y}/forecast',
            {
              params: {
                path: {
                  wfo: pointData.data.properties.gridId,
                  x: pointData.data.properties.gridX,
                  y: pointData.data.properties.gridY,
                },
              },
            },
          );

          if (forecastData.response.status === 200 && forecastData.data?.properties) {
            return forecastData.data.properties.periods;
          } else {
            console.log('No alerts found', forecastData.error);
            return [];
          }
        }
      } catch (error) {
        console.error(error);
        return [];
      }
    }),
});
