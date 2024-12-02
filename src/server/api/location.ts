"use server";

import { z } from "zod";

// Geocoding API - OpenWeatherMap: https://openweathermap.org/api/geocoding-api

// TYPES
// --------------------------------------------------------------

// BY ZIP
export type GeoLocateByZipParams = {
  zip: string;
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
export type LocationByZip = {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
} | null;

// BY NAME

type GeoLocateByName = {
  city: string;
  stateCode: string; // ISO 3166-1 alpha-2
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
interface LocalNames {
  [key: string]: string | undefined;
  en: string;
}
interface LocationByName {
  name: string;
  local_names: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// --------------------------------------------------------------

export const weatherKey = process.env.OPENWEATHER_API as string;

// export const geoLocation = createTRPCRouter({
// ----------------------------------------------------------
// GET LOCATION BY ZIPCODE
// ----------------------------------------------------------
// getGeoByZip: publicProcedure
//   .input(
//     z.object({
//       zip: z.string().length(5),
//       countryCode: z.string(),
//       limit: z.number().optional(),
//     }),
//   )
//   .query(async ({ input }) => {
//     const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${input.zip},${input.countryCode}&appid=${weatherKey}`;

//     try {
//       const res = await fetch(url);
//       const resJson: LocationByZip = await res.json();
//       console.log("LOCATION BY ZIP", resJson);

//       if (res.ok && resJson) {
//         return resJson;
//       } else {
//         console.error("LOCATION BY ZIP RESPONSE ERROR", res, resJson);
//         return null;
//       }
//     } catch (error) {
//       console.error("LOCATION BY ZIP ERROR", error);
//       return null;
//     }
//   }),

// ----------------------------------------------------------
// GET LOCATION BY LOCATION NAME
// ----------------------------------------------------------

//   getGeoByName: publicProcedure
//     .input(
//       z.object({
//         city: z.string(),
//         stateCode: z.string(),
//         countryCode: z.string(),
//         limit: z.number().optional(),
//       }),
//     )
//     .query(async ({ input }) => {
//       const url = `http://api.openweathermap.org/geo/1.0/direct?q=${input.city.replace(" ", "+")},${input.stateCode},${input.countryCode}&appid=${weatherKey}`;

//       try {
//         const res = await fetch(url);
//         const resJson: LocationByName[] = await res.json();
//         if (res.ok && resJson.length > 0) {
//           return resJson[0];
//         } else {
//           console.error("LOCATION BY NAME RESPONSE ERROR", res, resJson);
//           return null;
//         }
//       } catch (error) {
//         console.error(error);
//         return null;
//       }
//     }),
// });

// ORIGINAL CODE - GET LOCATION BY ZIP

export async function getLocationByZip(
  params: GeoLocateByZipParams,
): Promise<LocationByZip | null> {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${params.zip},${params.countryCode}&appid=${weatherKey}`;

  try {
    const res = await fetch(url);
    const resJson: LocationByZip = await res.json();

    if (res.ok && resJson) {
      return resJson;
    } else {
      console.error("LOCATION BY ZIP RESPONSE ERROR", res, resJson);
      return null;
    }
  } catch (error) {
    console.error("LOCATION BY ZIP ERROR", error);
    return null;
  }
}

// ORIGNAL CODE - GET LOCATION BY CITY NAME

export async function getLocationByName(params: GeoLocateByName) {
  const city = params.city.replace(" ", "+");

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${params.stateCode},${params.countryCode}&appid=${weatherKey}`;

  try {
    const res = await fetch(url);
    const resJson: LocationByName[] = await res.json();
    if (res.ok && resJson.length > 0) {
      return resJson[0];
    } else {
      console.error("LOCATION BY NAME RESPONSE ERROR", res, resJson);
      return [];
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
