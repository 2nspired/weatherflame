// TODO: Zod validation and error messages

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------

// BY ZIP
export type GeoLocateByZipParams = {
  zip: string;
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
export type GeoByZip = {
  name: string;
  country: string;
  lat: number;
  lon: number;
} | null;

// BY NAME
export type GeoLocateByName = {
  name: string;
  stateCode: string; // ISO 3166-1 alpha-2
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
} | null;
interface LocalNames extends Record<string, string | undefined> {
  en: string;
}

type GeoByName = Array<{
  name: string;
  local_names: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}>;

// ZONE BY GEO
export interface ZoneByGeoResponse {
  '@context': {
    '@version': string; // Example: "1.1"
  };
  type: 'FeatureCollection'; // Always "FeatureCollection"
  features: Feature[];
}

export interface Feature {
  id: string; // Example: "https://api.weather.gov/zones/county/MNC137"
  type: 'Feature'; // Always "Feature"
  geometry: null; // Assuming geometry is null in this response
  properties: FeatureProperties;
}

export interface FeatureProperties {
  '@id': string; // Example: "https://api.weather.gov/zones/county/MNC137"
  '@type': 'wx:Zone'; // Always "wx:Zone"
  id: string; // Example: "MNC137"
  type: 'county' | 'fire' | 'public'; // Enum for different zone types
  name: string; // Example: "St. Louis" or "Carlton/South St. Louis"
  effectiveDate: string; // ISO8601 date-time string, e.g., "2024-03-05T18:00:00+00:00"
  expirationDate: string; // ISO8601 date-time string, e.g., "2200-01-01T00:00:00+00:00"
  state: string; // Example: "MN"
  forecastOffice: string; // Example: "https://api.weather.gov/offices/DLH"
  gridIdentifier: string; // Example: "DLH"
  awipsLocationIdentifier: string; // Example: "DLH"
  cwa: string[]; // Example: ["DLH"]
  forecastOffices: string[]; // Example: ["https://api.weather.gov/offices/DLH"]
  timeZone: string[]; // Example: ["America/Chicago"]
  observationStations: string[]; // URLs of observation stations
  radarStation: string | null; // Example: "DLH" or null
}

// --------------------------------------------------------------
// ZOD SCHEMAS
// --------------------------------------------------------------

export const getGeoByZipSchema = z.object({
  zip: z
    .string()
    .length(5)
    .regex(/^\d{5}$/, 'Invalid zipcode format'),
  maxRetries: z.number().optional().default(1),
});

export const getGeoByNameSchema = z.object({
  name: z
    .string()
    .min(1, 'City name cannot be empty')
    .regex(/^[a-zA-Z\s]+$/, 'City name must contain only letters and spaces'),
  state: z
    .string()
    .min(2, 'State code cannot be empty')
    .regex(/^[A-Z]{2}$/, 'State code must be a valid ISO 3166-1 alpha-2 code')
    .optional(),
  countryCode: z
    .string()
    .min(2, 'Country code cannot be empty')
    .regex(/^[A-Z]{2}$/, 'Country code must be a valid ISO 3166-1 alpha-2 code')
    .optional(),
  limit: z.number().optional(),
  maxRetries: z.number().optional().default(1),
});

// ROUTER

export const locationRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET LOCATION BY ZIPCODE
  // https://openweathermap.org/api/geocoding-api
  // ----------------------------------------------------------

  getGeoByZip: publicProcedure.input(getGeoByZipSchema).mutation(async ({ input }) => {
    const url = `https://api.openweathermap.org/geo/1.0/zip?zip=${input.zip},US&appid=${process.env.OPENWEATHER_API}`;

    let attempts = 0;

    while (attempts < input.maxRetries) {
      try {
        const res = await fetch(url);
        const resJson: GeoByZip = (await res.json()) as GeoByZip;

        if (res.ok && resJson) {
          console.log('LOCATION BY ZIP RESPONSE', resJson);
          return resJson;
        }
        console.error(`Failed to fetch geo coordinates by zipcode ${res.status}, ${url}`);
      } catch (error) {
        console.error('Error fetching geo by zip:', error);
      }
      attempts++;
      if (attempts >= input.maxRetries) {
        console.error('MAX RETRIES REACHED: getGeoByZip');
        return null;
      }
      console.warn(`Retrying (${attempts}/${input.maxRetries})`);
    }
  }),

  // ----------------------------------------------------------
  // GET LOCATION BY LOCATION NAME
  // https://openweathermap.org/api/geocoding-api
  // ----------------------------------------------------------

  getGeoByName: publicProcedure.input(getGeoByNameSchema).mutation(async ({ input }) => {
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${input.name.replace(' ', '+')}`;
    if (input.state) {
      url += `,${input.state}`;
    }
    if (input.countryCode) {
      url += `,${input.countryCode}`;
    }
    url += `&appid=${process.env.OPENWEATHER_API}`;

    let attempts = 0;

    while (attempts < input.maxRetries) {
      try {
        const res = await fetch(url);
        const resJson: GeoByName = (await res.json()) as GeoByName;

        if (res.ok && resJson) {
          console.log('LOCATION BY NAME RESPONSE', resJson);
          return resJson;
        }
        console.error(`Failed to fetch geo coordinates by name ${res.status}, ${url}`);
      } catch (error) {
        console.error('Error fetching geo by name:', error);
      }
      attempts++;
      if (attempts >= input.maxRetries) {
        console.error('MAX RETRIES REACHED: getGeoByName');
        return null;
      }
      console.warn(`Retrying (${attempts}/${input.maxRetries})`);
    }
  }),

  // ----------------------------------------------------------
  // GET LOCATION BY GEO COORDINATES - REVERSE LOOKUP
  // https://openweathermap.org/api/geocoding-api
  // ----------------------------------------------------------

  getReverseGeo: publicProcedure
    .input(
      z.object({
        lat: z.number({ message: 'Latitude is required' }),
        lon: z.number({ message: 'Longitude is required' }),
        limit: z.number().optional(),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${input.lat}&lon=${input.lon}&limit=${input.limit}&appid=${process.env.OPENWEATHER_API}`;

      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const res = await fetch(url);
          const resJson: GeoByZip = (await res.json()) as GeoByZip;

          if (res.ok && resJson) {
            console.log('LOCATION BY REVERSE GEO RESPONSE', resJson);
            return resJson;
          }
          console.error(
            `Failed to fetch location by geo coordinates ${res.status}, ${url}`,
          );
        } catch (error) {
          console.error('Error fetching reverse geo:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getReverseGeo');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET ZONE IDS BY LOCATION COORDINATES (PUBLIC, COUNTY, FIRE)

  // Pulls various public, county, and fire zone IDs based on the location coordinates
  // https://www.weather.gov/documentation/services-web-api
  // ----------------------------------------------------------

  getZoneByGeo: publicProcedure
    .input(
      z.object({
        lat: z.string({ message: 'Latitude is required' }),
        lon: z.string({ message: 'Longitude is required' }),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const url = `https://api.weather.gov/zones?point=${input.lat},${input.lon}`;
      console.log('URL', url);

      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const res = await fetch(url);
          const resJson: ZoneByGeoResponse = (await res.json()) as ZoneByGeoResponse;

          if (res.ok && resJson) {
            console.log('ZONE BY GEO RESPONSE', resJson);
            return resJson;
          }
          console.error('ZONE BY GEO RESPONSE ERROR', resJson);
        } catch (error) {
          console.error('Error fetching zone by geo:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getZoneByGeo');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
});
