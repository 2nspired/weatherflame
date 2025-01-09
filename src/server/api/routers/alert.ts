import createClient from 'openapi-fetch';
import { z } from 'zod';

import {
  landAreaSchema,
  marineAreaSchema,
} from '~/app/types/weather-gov/landMarineAreas';
import type { components, paths } from '~/app/types/weather-gov/weatherGov';
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
  // GET ACTIVE WEATHER ALERTS - MAIN
  // ----------------------------------------------------------

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
      const maxRetries = 3;
      let attempts = 0;
      while (attempts < maxRetries) {
        try {
          const { response, data, error } = await fetchClient.GET('/alerts/active', {
            params: {
              query: {
                ...input,
              },
            },
          });

          if (response.status === 200) {
            if (data && data.features.length > 0) {
              // console.log('ALERTS RESPONSE', data.features);
              return data.features;
            } else {
              console.log('No alerts found');
              return [];
            }
          }

          if (error) {
            console.error('Error fetching alerts:', error);
          }
          console.error(`Failed to fetch alerts, ${response.status}`);
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
        attempts++;
        if (attempts >= maxRetries) {
          console.error('MAX RETRIES REACHED: getAlerts');
          return null;
        }
        console.warn(`Retrying (${attempts}/${maxRetries})`);
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
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          const { response, data, error } = await fetchClient.GET(
            '/alerts/active/zone/{zoneId}',
            {
              params: {
                path: {
                  zoneId: input.zone,
                },
              },
            },
          );

          if (response.ok && data && data.features.length > 0) {
            // console.log('ALERTS BY ZONE RESPONSE', data.features);
            return data.features;
          }

          if (error) {
            console.error('ERROR FETCHING ALERTS:', error);
          }
          console.error(`FAILED TO FETCH ALERTS BY SINGLE ZONE, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING ALERTS BY SINGLE ZONE:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getAlertsByZone');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
});
