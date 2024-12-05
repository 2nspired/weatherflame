'use server';

import createClient from 'openapi-fetch';
import { z } from 'zod';

import type { components, paths } from '~/app/types/weatherGov.d.ts';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// // TYPES

export type AlertParams = paths['/alerts/active']['get']['parameters']['query'];

export type Alert = components['schemas']['Alert'];

export type AlertFeatureResponse =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'];

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

export const alertRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET ACTIVE WEATHER ALERTS
  // ----------------------------------------------------------
  getActiveAlerts: publicProcedure
    .input(
      z.object({
        status: z
          .array(z.enum(['actual', 'exercise', 'system', 'test', 'draft']))
          .optional(),
        message_type: z.array(z.enum(['alert', 'update', 'cancel'])).optional(),
        event: z.array(z.string()).optional(),
        code: z.array(z.string()).optional(),
        area: z
          .array(
            z.enum([
              'AL',
              'AK',
              'AS',
              'AR',
              'AZ',
              'CA',
              'CO',
              'CT',
              'DE',
              'DC',
              'FL',
              'GA',
              'GU',
              'HI',
              'ID',
              'IL',
              'IN',
              'IA',
              'KS',
              'KY',
              'LA',
              'ME',
              'MD',
              'MA',
              'MI',
              'MN',
              'MS',
              'MO',
              'MT',
              'NE',
              'NV',
              'NH',
              'NJ',
              'NM',
              'NY',
              'NC',
              'ND',
              'OH',
              'OK',
              'OR',
              'PA',
              'RI',
              'SC',
              'SD',
              'TN',
              'TX',
              'UT',
              'VT',
              'VA',
              'WA',
              'WV',
              'WI',
              'WY',
              'SL',
            ]),
          )
          .optional(),
        region: z.array(z.enum(['AL', 'PA', 'GM', 'AT', 'GL', 'PI'])).optional(),
        limit: z.number().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { response, data, error } = await fetchClient.GET('/alerts/active', {
          params: {
            query: {
              ...input,
            },
          },
        });

        if (response.status === 200 && data && data.features.length > 0) {
          return data.features;
        } else if (response.status !== 200 || !data || data.features.length === 0) {
          console.log('No alerts found', error);
          return null;
        }

        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
