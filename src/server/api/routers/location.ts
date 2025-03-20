import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { stateAbv } from '~/utilities/formatters/stateAbv';
import { db } from '~/utilities/prisma';
import slugifyString from '~/utilities/slug/slugify';

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

export type ReverseGeoParams = {
  lat: number;
  lon: number;
  limit?: number;
};

export type ReverseGeo = Array<{
  name: string;
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
  geometry: null;
  properties: FeatureProperties;
}

export interface FeatureProperties {
  '@id': string; // Example: "https://api.weather.gov/zones/county/MNC137"
  '@type': 'wx:Zone';
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
    .length(5, 'server: zipcode must be 5 digits')
    .regex(/^\d{5}$/, 'Invalid zipcode format'),
  maxRetries: z.number().optional().default(1),
});

export const getGeoByNameSchema = z.object({
  name: z
    .string()
    .min(2, 'City name cannot be empty')
    .regex(/^[a-zA-Z\s]+$/, 'City name must contain only letters and spaces'),
  state: z
    .string()
    .min(2, 'State code cannot be empty')
    .regex(
      /^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/,
      'State code must be a valid ISO 3166-2:US state code',
    )
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
          // console.log('LOCATION BY ZIP RESPONSE', resJson);
          return resJson;
        }
        console.error(`FAILED TO FETCH GEO COORDINATES BY ZIPCODE ${res.status}, ${url}`);
      } catch (error) {
        console.error('ERROR FETCHING GEO BY ZIP:', error);
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
    console.log('GEOBYNAMEURL', url);
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
        if (res.ok && resJson && resJson.length > 0) {
          // console.log('LOCATION BY NAME RESPONSE', resJson);
          return resJson;
        }
        console.error(`FAILED TO FETCH GEO COORDINATES BY NAME ${res.status}, ${url}`);
      } catch (error) {
        console.error('ERROR FETCHING GEO BY NAME:', error);
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
          const resJson: ReverseGeo = (await res.json()) as ReverseGeo;

          if (res.ok && resJson) {
            // console.log('LOCATION BY REVERSE GEO RESPONSE', resJson);
            return resJson;
          }
          console.error(
            `FAILED TO FETCH LOCATION BY GEO COORDINATES ${res.status}, ${url}`,
          );
        } catch (error) {
          console.error('ERROR FETCHING REVERSE GEO:', error);
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
    .query(async ({ input }) => {
      const url = `https://api.weather.gov/zones?point=${input.lat},${input.lon}`;
      // console.log('URL', url);

      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const res = await fetch(url);
          const resJson: ZoneByGeoResponse = (await res.json()) as ZoneByGeoResponse;

          if (res.ok && resJson) {
            console.log('ZONE BY GEO RESPONSE', resJson);
            return resJson;
          }
          console.error(
            `FAILED TO FETCH LOCATION BY GEO COORDINATES ${res.status}, ${url}`,
          );
        } catch (error) {
          console.error('ERROR FETCHING ZONE BY GEO:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getZoneByGeo');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET LOCATION BY ZIPCODE - REFACTORED
  // ----------------------------------------------------------

  getLocationByZip: publicProcedure
    .input(getGeoByZipSchema)
    .mutation(async ({ input }) => {
      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const existingLocation = await db.zipCodes.findUnique({
            where: {
              zipcode: input.zip,
            },
            select: {
              cities: {
                select: {
                  city: {
                    select: {
                      name: true,
                      state: true,
                      country: true,
                      lat: true,
                      lng: true,
                    },
                  },
                },
              },
            },
          });

          if (existingLocation?.cities[0]?.city) {
            const city = existingLocation.cities[0]?.city;
            console.log('❇️ Existing location found in DB:', city.name);

            return city;
          }

          console.log(
            '🛑 Existing location NOT found in DB, fetching location by zip:',
            input.zip,
          );
          const url = `https://api.openweathermap.org/geo/1.0/zip?zip=${input.zip},US&appid=${process.env.OPENWEATHER_API}`;

          const zipRes = await fetch(url);
          const zipResJson: GeoByZip = (await zipRes.json()) as GeoByZip;

          if (!zipRes.ok && !zipResJson) {
            console.error('FAILED TO FETCH LOCATION BY ZIPCODE', zipRes.status, url);
          }

          if (zipRes.ok && zipResJson) {
            const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${zipResJson.lat}&lon=${zipResJson.lon}&limit=${1}&appid=${process.env.OPENWEATHER_API}`;

            const reverseRes = await fetch(url);
            const reverseResJson: ReverseGeo = (await reverseRes.json()) as ReverseGeo;

            if (reverseRes.ok && reverseResJson?.[0]) {
              const city = reverseResJson[0];

              const checkedLocation = await db.cities.findUnique({
                where: {
                  slug: slugifyString(
                    `${city.name} ${stateAbv(city.state)} ${city.country}`,
                  ),
                },
                select: {
                  name: true,
                  state: true,
                  country: true,
                  lat: true,
                  lng: true,
                  slug: true,
                },
              });
              if (checkedLocation) {
                console.log('❇️ Location already exists in DB:', checkedLocation);
                return checkedLocation;
              }

              const newCity = await db.zipCodes.create({
                data: {
                  zipcode: input.zip,
                  cities: {
                    create: {
                      city: {
                        create: {
                          slug: slugifyString(
                            `${city.name} ${stateAbv(city.state)} ${city.country}`,
                          ),
                          name: city.name,
                          state: city.state,
                          country: city.country,
                          lat: city.lat,
                          lng: city.lon,
                        },
                      },
                    },
                  },
                },
                select: {
                  cities: {
                    select: {
                      city: {
                        select: {
                          name: true,
                          state: true,
                          country: true,
                          lat: true,
                          lng: true,
                          slug: true,
                        },
                      },
                    },
                  },
                },
              });

              if (!newCity) {
                console.error('Failed to create new city in DB, trying again...');
              }
              if (newCity?.cities?.[0]?.city) {
                console.log('❇️ New city created:', newCity);
                return newCity?.cities?.[0].city;
              }
            }
          }
        } catch (error) {
          console.error('ERROR FETCHING LOCATION BY ZIP:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getLocationByZip');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET LOCATION BY NAME - REFACTORED
  // ----------------------------------------------------------

  getLocationByName: publicProcedure
    .input(getGeoByNameSchema)
    .mutation(async ({ input }) => {
      // return {
      //   name: 'testName',
      //   state: 'testState',
      //   country: 'testCountry',
      //   lat: 12.0,
      //   lng: -12.0,
      //   slug: 'test-slug',
      // };
      let attempts = 0;

      while (attempts < input.maxRetries) {
        try {
          console.log(
            '❇️ GETTING LOCATION BY NAME',
            slugifyString(`${input.name} ${input?.state} ${input.countryCode}`),
          );
          const existingLocation = await db.cities.findUnique({
            where: {
              slug: slugifyString(
                `${input.name} ${input?.state} ${input.countryCode ?? 'US'}`,
              ),
            },
            select: {
              name: true,
              state: true,
              country: true,
              lat: true,
              lng: true,
              slug: true,
            },
          });

          if (existingLocation) {
            console.log(
              '❇️ Existing location found in DB:',
              existingLocation.name,
              existingLocation.state,
            );

            return existingLocation;
          }

          console.log(
            '🛑 Existing location NOT found in DB, fetching location by name:',
            input.name,
            input.state,
          );

          let url = `https://api.openweathermap.org/geo/1.0/direct?q=${input.name.replace(' ', '+')}`;
          // console.log('GEOBYNAMEURL', url);
          if (input.state) {
            url += `,${stateAbv(input.state, true)}`;
          }
          if (input.countryCode) {
            url += `,${input.countryCode}`;
          }
          url += `&appid=${process.env.OPENWEATHER_API}`;

          console.log('Fetching location by name with URL:', url);

          const res = await fetch(url);
          const resJson: GeoByName = (await res.json()) as GeoByName;

          if (!res.ok && !resJson) {
            console.error('FAILED TO FETCH LOCATION BY NAME', res.status, url);
          }

          if (res.ok && resJson[0] && resJson.length > 0) {
            const city = resJson[0];
            console.log('❇️ Fetched location:', city);

            const newCity = await db.cities.create({
              data: {
                name: city.name,
                state: city.state,
                country: city.country,
                lat: city.lat,
                lng: city.lon,
                slug: slugifyString(
                  `${city.name} ${stateAbv(city.state)} ${city.country}`,
                ),
              },
              select: {
                name: true,
                state: true,
                country: true,
                lat: true,
                lng: true,
                slug: true,
              },
            });

            if (!newCity) {
              console.error('Failed to create new city in DB, trying again...');
            }
            if (newCity) {
              console.log('❇️ New city created:', newCity.name, newCity.state);
              return newCity;
            }
          }
        } catch (error) {
          console.error('ERROR FETCHING GEO BY NAME:', error);
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
  // GET LOCATION BY REVERSE LOOKUP - REFACTORED
  // ----------------------------------------------------------

  getLocationReverse: publicProcedure
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
          console.log('❇️ GETTING LOCATION BY REVERSE GEO');

          const existingLocation = await db.cities.findMany({
            where: {
              lat: input.lat,
              lng: input.lon,
            },
            select: {
              name: true,
              state: true,
              country: true,
              lat: true,
              lng: true,
            },
          });

          if (existingLocation?.[0]) {
            console.log('❇️ Existing location found in DB:', existingLocation[0]);

            return existingLocation[0];
          }

          console.log('🛑 Existing location NOT found in DB, fetching location:');
          const res = await fetch(url);
          const resJson: ReverseGeo = (await res.json()) as ReverseGeo;

          if (!res.ok && !resJson) {
            console.error('FAILED TO FETCH LOCATION BY GEO COORDINATES', res.status, url);
          }

          if (res.ok && resJson?.[0]) {
            // console.log('LOCATION BY REVERSE GEO RESPONSE', resJson);
            const city = resJson[0];
            console.log('❇️ Fetched location:', city);

            const checkedLocation = await db.cities.findUnique({
              where: {
                slug: slugifyString(
                  `${city.name} ${stateAbv(city.state)} ${city.country ?? 'US'}`,
                ),
              },
              select: {
                name: true,
                state: true,
                country: true,
                lat: true,
                lng: true,
                slug: true,
              },
            });

            if (checkedLocation) {
              console.log('❇️ Location already exists in DB:', checkedLocation);
              return checkedLocation;
            }

            const newCity = await db.cities.create({
              data: {
                name: city.name,
                state: city.state,
                country: city.country,
                lat: city.lat,
                lng: city.lon,
                slug: slugifyString(
                  `${city.name} ${stateAbv(city.state)} ${city.country}`,
                ),
              },
              select: {
                name: true,
                state: true,
                country: true,
                lat: true,
                lng: true,
              },
            });

            if (!newCity) {
              console.error('Failed to create new city in DB, trying again...');
            }

            if (newCity) {
              console.log('❇️ New city created:', newCity);
              return newCity;
            }
          }
          console.error(
            `FAILED TO FETCH LOCATION BY GEO COORDINATES ${res.status}, ${url}`,
          );
        } catch (error) {
          console.error('ERROR FETCHING REVERSE GEO:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getReverseGeo');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
});
