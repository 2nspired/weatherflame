import createClient from 'openapi-fetch';
import { z } from 'zod';

import type { paths } from '~/app/types/weather-gov/weatherGov';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// // TYPES

// export type AlertParams = paths['/alerts/active']['get']['parameters']['query'];

// export type Alert = components['schemas']['Alert'];

// export type AlertFeatureResponse =
//   components['responses']['AlertCollection']['content']['application/geo+json']['features'];

// TODO: SETUP ZOD OBJECT, REFERENCE TO CITIES DATABASE

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
