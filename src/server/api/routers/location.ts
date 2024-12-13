// TODO: Zod validation and error messages

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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

// ROUTER

export const locationRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET LOCATION BY ZIPCODE
  // https://openweathermap.org/api/geocoding-api
  // ----------------------------------------------------------
  getGeoByZip: publicProcedure
    .input(
      z.object({
        zip: z.string().length(5),
        countryCode: z.string(),
        limit: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${input.zip},${input.countryCode}&appid=${process.env.OPENWEATHER_API}`;

      try {
        const res = await fetch(url);
        const resJson: GeoByZip = (await res.json()) as GeoByZip;

        if (res.ok && resJson) {
          console.log('LOCATION BY ZIP RESPONSE', resJson);
          return resJson;
        } else {
          console.error('LOCATION BY ZIP RESPONSE ERROR', resJson);
          throw new Error('Failed to fetch geo coordinates');
        }
      } catch (error) {
        console.error('LOCATION BY ZIP ERROR', error);
        throw new Error('Failed to fetch geo coordinates');
      }
    }),

  // ----------------------------------------------------------
  // GET LOCATION BY LOCATION NAME
  // ----------------------------------------------------------

  getGeoByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        stateCode: z.string().optional(),
        countryCode: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let url = `http://api.openweathermap.org/geo/1.0/direct?q=${input.name.replace(' ', '+')}`;
      if (input.stateCode) {
        url += `,${input.stateCode}`;
      }
      if (input.countryCode) {
        url += `,${input.countryCode}`;
      }
      url += `&appid=${process.env.OPENWEATHER_API}`;

      console.log('LOCATION BY NAME URL', url);

      try {
        const res = await fetch(url);
        const resJson: GeoByName = (await res.json()) as GeoByName;
        console.log('LOCATION BY NAME RESPONSE', resJson);

        if (resJson) {
          return resJson;
        } else {
          console.error('LOCATION BY NAME RESPONSE ERROR', resJson);
          throw new Error('Failed to fetch geo coordinates');
        }
      } catch (error) {
        console.error('LOCATION BY NAME ERROR', error);
        throw new Error('Failed to fetch geo coordinates');
      }
    }),

  // ----------------------------------------------------------
  // GET LOCATION BY GEO COORDINATES - REVERSE LOOKUP
  // ----------------------------------------------------------

  getReverseGeo: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lon: z.number(),
        limit: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${input.lat}&lon=${input.lon}&limit=${input.limit}&appid=${process.env.OPENWEATHER_API}`;

      try {
        const res = await fetch(url);
        const resJson: GeoByZip = (await res.json()) as GeoByZip;
        if (res.ok && resJson) {
          return resJson;
        } else {
          console.error('REVERSE GEO RESPONSE ERROR', resJson);
          throw new Error('Failed to fetch geo coordinates');
        }
      } catch (error) {
        console.error('REVERSE GEO ERROR', error);
        throw new Error('Failed to fetch geo coordinates');
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
        lat: z.string(),
        lon: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log('ZONE BY GEO INPUTS', input);

      const url = `http://api.weather.gov/zones?point=${input.lat},${input.lon}`;
      console.log('URL', url);
      try {
        const res = await fetch(url);
        const resJson: ZoneByGeoResponse = (await res.json()) as ZoneByGeoResponse; // Explicitly type the response
        console.log('ZONE BY GEO RESPONSE', resJson);

        if (res.ok && resJson) {
          return resJson;
        } else {
          console.error('ZONE BY GEO RESPONSE ERROR', resJson);
          throw new Error('Failed to fetch zone IDs');
        }
      } catch (error) {
        console.error('ZONE BY GEO ERROR', error);
        throw new Error('Failed to fetch zone IDs');
      }
    }),
});
