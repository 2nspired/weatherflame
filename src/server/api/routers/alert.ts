import createClient from 'openapi-fetch';
import { z } from 'zod';

import type { components, paths } from '~/app/types/weather-gov/weatherGov';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// // TYPES

export type AlertParams = paths['/alerts/active']['get']['parameters']['query'];

export type Alert = components['schemas']['Alert'];

export type AlertFeatureResponse =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'];

const landAreaSchema = z.enum([
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
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'MP',
  'PW',
  'FM',
  'MH',
]);

const marineAreaSchema = z.enum([
  'AM',
  'AN',
  'GM',
  'LC',
  'LE',
  'LH',
  'LM',
  'LO',
  'LS',
  'PH',
  'PK',
  'PM',
  'PS',
  'PZ',
  'SL',
]);

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
  // GET ACTIVE WEATHER ALERTS - MAIN
  // ----------------------------------------------------------

  // TODO:
  getAlerts: publicProcedure
    .input(
      z.object({
        active: z.boolean().optional(),
        status: z
          .array(z.enum(['actual', 'exercise', 'system', 'test', 'draft']))
          .optional(),
        // POINT: incompatible with: area, region, region_type, zone
        point: z
          .string()
          .regex(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/)
          .optional(),
        message_type: z.array(z.enum(['alert', 'update', 'cancel'])).optional(),
        event: z.array(z.string().regex(/^[A-Za-z0-9 ]+$/)).optional(),
        code: z.array(z.string().regex(/^\w{3}$/)).optional(),
        // AREA: incompatible with: point, region, region_type, zone
        area: z.array(z.union([landAreaSchema, marineAreaSchema])).optional(),
        // REGION: incompatible with: area, point, region_type, zone
        region: z.array(z.enum(['AL', 'AT', 'GL', 'GM', 'PA', 'PI'])).optional(),
        // REGION TYPE: incompatible with: area, point, region, zone
        region_type: z.enum(['land', 'marine']).optional(),
        // ZONE: incompatible with: area, point, region, region_type
        zone: z
          .array(
            z
              .string()
              .regex(
                /^(A[KLMNRSZ]|C[AOT]|D[CE]|F[LM]|G[AMU]|I[ADLN]|K[SY]|L[ACEHMOS]|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[AHKMRSWZ]|S[CDL]|T[NX]|UT|V[AIT]|W[AIVY]|[HR]I)[CZ]\d{3}$/,
              ),
          )
          .optional(),
        urgency: z
          .array(z.enum(['Immediate', 'Expected', 'Future', 'Past', 'Unknown']))
          .optional(),
        severity: z
          .array(z.enum(['Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown']))
          .optional(),
        certainty: z
          .array(z.enum(['Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown']))
          .optional(),
        limit: z.number().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      // console.log('ALERT PARAMS INPUTS', input);

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
          return [];
        }

        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    }),

  // ----------------------------------------------------------
  // GET ACTIVE WEATHER ALERTS BY SPECIFIC WEATHER ZONE
  // ----------------------------------------------------------

  getAlertsByZone: publicProcedure
    .input(
      z.object({
        zone: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      // console.log('ALERT PARAMS INPUTS', input);

      try {
        const { response, data, error } = await fetchClient.GET(
          '/alerts/active/zone/{zoneId}',
          {
            params: {
              query: undefined,
              header: undefined,
              path: {
                zoneId: input.zone,
              },
              cookie: undefined,
            },
          },
        );

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
