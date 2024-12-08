// TODO: Zod validation and error messages

import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

// Geocoding API - OpenWeatherMap: https://openweathermap.org/api/geocoding-api

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
  state: string;
  lat: number;
  lon: number;
} | null;

// BY NAME
export type GeoLocateByName = {
  city: string;
  stateCode: string; // ISO 3166-1 alpha-2
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
} | null;
interface LocalNames {
  [key: string]: string | undefined;
  en: string;
}
interface GeoByName {
  name: string;
  local_names: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// --------------------------------------------------------------

// ROUTER

export const locationRouter = createTRPCRouter({
  // ----------------------------------------------------------
  // GET LOCATION BY ZIPCODE
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
        const resJson = (await res.json()) as GeoByZip;

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
        city: z.string(),
        stateCode: z.string(),
        countryCode: z.string(),
        limit: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${input.city.replace(' ', '+')},${input.stateCode},${input.countryCode}&appid=${process.env.OPENWEATHER_API}`;

      try {
        // const resJson = await fetchJson<GeoByName>(url);
        const res = await fetch(url);
        const resJson = (await res.json()) as GeoByName;

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
  // GET LOCATION BY GEO COORDINATES
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
        const resJson = (await res.json()) as GeoByZip;

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
  // ----------------------------------------------------------
  // Pulls various public, county, and fire zone IDs based on the location coordinates
  getWeatherZoneByGeo: publicProcedure
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
        const resJson = await res.json();

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

  // ----------------------------------------------------------
  // GET ZONE IDS BY LOCATION COORDINATES (PUBLIC, COUNTY, FIRE) - NOT WEATHER ZONES
  // ----------------------------------------------------------
  // Pulls various public, county, and fire zone IDs based on the location coordinates

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
        const resJson = await res.json();
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
