import createClient from 'openapi-fetch';
import { z } from 'zod';

import { weatherForecastOffices } from '~/app/types/weather-gov/weatherForecastOffices';
import type { components, paths } from '~/app/types/weather-gov/weatherGov';
import { type ZoneByGeoResponse } from '~/server/api/routers/location';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { formatAsLocalDate, formatDate } from '~/utilities/formatters/formatDate';

// --------------------------------------------------------------
// TYPES

type ForecastPeriods = components['schemas']['GridpointForecast']['periods'];
type ForecastPeriod = components['schemas']['GridpointForecastPeriod'];

type WeeklyForecast = { day: ForecastPeriod; night: ForecastPeriod | null }[];

type FormattedForecast = {
  temperature: number | undefined;
  detailedForecast: string | undefined;
  shortForecast: string | undefined;
  windSpeed: string | undefined;
  windDirection:
    | 'N'
    | 'NNE'
    | 'NE'
    | 'ENE'
    | 'E'
    | 'ESE'
    | 'SE'
    | 'SSE'
    | 'S'
    | 'SSW'
    | 'SW'
    | 'WSW'
    | 'W'
    | 'WNW'
    | 'NW'
    | 'NNW'
    | undefined;
  humidity: number | undefined;
  rainChance: number | undefined;
};

export type WeeklyForecastChart = {
  date: string;
  day: FormattedForecast;
  night: FormattedForecast;
}[];

type AllWeather = {
  hourlyForecast: ForecastPeriods | null;
  weeklyForecast: WeeklyForecast | null;
  weeklyForecastChart: WeeklyForecastChart | null;
};

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
            // console.log('POINT WEATHER DATA RESPONSE', data);
            return data.properties;
          }

          if (error) {
            console.error('ERROR FETCHING FORECAST BY POINT:', error);
          }
          console.error(`FAILED TO FETCH FORECASE BY POINT, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING FORECAST BY POINT:', error);
        }
        attempts++;

        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getPointWeather');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),

  // ----------------------------------------------------------
  // GET WEEKLY WEATHER FORECAST
  // ----------------------------------------------------------

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
            // console.log('WEEKLY FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
          }
          if (error) {
            console.error('ERROR FETCHING WEEKLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH WEEKLY FORECASE, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING FORECAST:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getForecast');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
  // ----------------------------------------------------------
  // GET HOURLY WEATHER FORECAST
  // ----------------------------------------------------------

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

          if (response.ok && data?.properties?.periods) {
            // console.log('HOURLY FORECAST RESPONSE', data.properties.periods);
            return data.properties.periods;
          }
          if (error) {
            console.error('ERROR FETCHING HOURLY FORECAST:', error);
          }
          console.error(`FAILED TO FETCH HOURLY FORECAST, ${response.status}`);
        } catch (error) {
          console.error('ERROR FETCHING HOURLY FORECAST:', error);
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
  // GET COMPLETE WEATHER FORECAST BY POINT
  // ----------------------------------------------------------

  getAllWeather: publicProcedure
    .input(
      z.object({
        lat: z.string({ message: 'Latitude is required' }).regex(/^(-?\d+(\.\d+)?)/),
        lon: z.string({ message: 'Longitude is required' }).regex(/^(-?\d+(\.\d+)?)/),
        maxRetries: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      let weeklyForecast = null;
      let hourlyForecast = null;
      let forecastZones = null;

      let attempts = 0;
      while (attempts < input.maxRetries) {
        try {
          const pointData = await fetchClient.GET('/points/{point}', {
            params: {
              path: {
                point: `${input.lat},${input.lon}`,
              },
            },
          });

          if (pointData.response.ok && pointData.data && pointData.data.properties) {
            // console.log('POINT DATA RESPONSE', pointData.data);

            const zonesURL = `https://api.weather.gov/zones?point=${input.lat},${input.lon}`;
            const res = await fetch(zonesURL);
            const resJson: ZoneByGeoResponse = (await res.json()) as ZoneByGeoResponse;

            if (res.ok && resJson) {
              forecastZones = resJson.features.map((zone) => zone.properties.id);
            }

            const { cwa, gridX, gridY } = pointData.data.properties;

            if (cwa && gridX && gridY) {
              if (weatherForecastOffices.safeParse(cwa).success) {
                [weeklyForecast, hourlyForecast] = await Promise.all([
                  fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast', {
                    params: {
                      path: {
                        wfo: cwa,
                        x: gridX,
                        y: gridY,
                      },
                    },
                  }),
                  fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast/hourly', {
                    params: {
                      path: {
                        wfo: cwa,
                        x: gridX,
                        y: gridY,
                      },
                    },
                  }),
                ]);
              } else {
                const parsedCwa = weatherForecastOffices.safeParse(cwa);
                if (parsedCwa.success) {
                  [weeklyForecast, hourlyForecast] = await Promise.all([
                    fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast', {
                      params: {
                        path: {
                          wfo: cwa,
                          x: gridX,
                          y: gridY,
                        },
                      },
                    }),
                    fetchClient.GET('/gridpoints/{wfo}/{x},{y}/forecast/hourly', {
                      params: {
                        path: {
                          wfo: cwa,
                          x: gridX,
                          y: gridY,
                        },
                      },
                    }),
                  ]);
                } else {
                  console.error('Invalid CWA:', cwa);
                }
              }
            }
          }

          const forecast: AllWeather = {
            hourlyForecast: null,
            weeklyForecast: null,
            weeklyForecastChart: null,
          };

          if (weeklyForecast?.response.ok && weeklyForecast?.data?.properties?.periods) {
            const daytimeForecasts = weeklyForecast.data.properties.periods.filter(
              (forecast) => forecast.isDaytime,
            );
            const nighttimeForecasts = weeklyForecast.data.properties.periods.filter(
              (forecast) => !forecast.isDaytime,
            );

            const pairedForecasts = daytimeForecasts.map((day) => {
              const matchingNight = nighttimeForecasts.find(
                (night) => night.startTime === day.endTime,
              );

              return { day: day, night: matchingNight ?? null };
            });

            const averageTemps = () => {
              const highTemps = pairedForecasts.map((forecast) => {
                return typeof forecast.day.temperature === 'number'
                  ? forecast.day.temperature
                  : (forecast.day.temperature?.value ?? 0);
              });

              const lowTemps = pairedForecasts.map((forecast) => {
                return typeof forecast.night?.temperature === 'number'
                  ? forecast.night.temperature
                  : (forecast.night?.temperature?.value ?? 0);
              });

              function averageTemp(temps: number[]): number {
                const validTemps = temps.filter((temp) => temp !== 0);
                const sum = validTemps.reduce((acc, temp) => acc + temp, 0);
                return validTemps.length ? sum / validTemps.length : 0;
              }

              return {
                high: Math.round(averageTemp(highTemps)),
                low: Math.round(averageTemp(lowTemps)),
              };
            };

            const averageTempValues = averageTemps();

            const weeklyForecastChart = pairedForecasts.map((forecast) => {
              const date = forecast.day.startTime
                ? formatDate(forecast.day.startTime)
                : '';

              // const high =
              //   typeof forecast.day.temperature === 'number'
              //     ? forecast.day.temperature === 0
              //       ? averageTempValues.high
              //       : forecast.day.temperature
              //     : forecast.day.temperature?.value === 0
              //       ? averageTempValues.high
              //       : forecast.day.temperature?.value;
              // const low =
              //   typeof forecast.night?.temperature === 'number'
              //     ? forecast.night.temperature === 0 ||
              //       forecast.night.temperature === undefined
              //       ? averageTempValues.low
              //       : forecast.night.temperature
              //     : forecast.night?.temperature?.value === 0 ||
              //         forecast.night?.temperature?.value === undefined
              //       ? averageTempValues.low
              //       : forecast.night?.temperature?.value;

              return {
                date: date,
                day: {
                  temperature:
                    typeof forecast.day.temperature === 'number'
                      ? forecast.day.temperature === 0
                        ? averageTempValues.high
                        : forecast.day.temperature
                      : forecast.day.temperature?.value === 0
                        ? averageTempValues.high
                        : (forecast.day.temperature?.value ?? undefined),
                  detailedForecast: forecast.day.detailedForecast,
                  shortForecast: forecast.day.shortForecast,
                  // API DOCS STATE: "Wind speed for the period. This property as an string value is deprecated. Future versions will express this value as a quantitative value object. To make use of the future standard format now, set the "forecast_wind_speed_qv" feature flag on the request. HOWEVER, the API does not return the "forecast_wind_speed_qv" feature flag and only returns a string.
                  windSpeed:
                    typeof forecast.day.windSpeed === 'string'
                      ? forecast.day.windSpeed
                      : undefined,
                  windDirection: forecast.day.windDirection,
                  humidity: forecast.day.relativeHumidity?.value ?? undefined,
                  rainChance: forecast.day.probabilityOfPrecipitation?.value ?? undefined,
                },
                night: forecast.night
                  ? {
                      temperature:
                        typeof forecast.night?.temperature === 'number'
                          ? forecast.night.temperature === 0
                            ? averageTempValues.low
                            : forecast.night.temperature
                          : forecast.night?.temperature?.value === 0
                            ? averageTempValues.low
                            : (forecast.night?.temperature?.value ?? undefined),
                      detailedForecast: forecast.night?.detailedForecast,
                      shortForecast: forecast.night?.shortForecast,
                      // SEE WINDSPEED NOTE ABOVE
                      windSpeed:
                        typeof forecast.night.windSpeed === 'string'
                          ? forecast.night.windSpeed
                          : undefined,
                      windDirection: forecast.night?.windDirection,
                      humidity: forecast.night?.relativeHumidity?.value ?? undefined,
                      rainChance:
                        forecast.night?.probabilityOfPrecipitation?.value ?? undefined,
                    }
                  : {
                      temperature: averageTempValues.low,
                      detailedForecast: undefined,
                      shortForecast: undefined,
                      windSpeed: undefined,
                      windDirection: undefined,
                      humidity: undefined,
                      rainChance: undefined,
                    },
              };
            });

            console.log('WEEKLY FORECAST CHART:SERVER', weeklyForecastChart);
            // console.log('WEEKLY FORECAST', pairedForecasts);

            forecast.weeklyForecast = pairedForecasts as WeeklyForecast;
            forecast.weeklyForecastChart = weeklyForecastChart as WeeklyForecastChart;
          } else {
            console.error('FAILED TO FETCH WEEKLY FORECAST:', weeklyForecast?.error);
          }

          if (hourlyForecast?.response.ok && hourlyForecast?.data?.properties?.periods) {
            forecast.hourlyForecast = hourlyForecast.data.properties.periods;
          } else {
            console.error('FAILED TO FETCH HOURLY FORECAST:', hourlyForecast?.error);
          }

          if (
            forecast.weeklyForecast ||
            forecast.hourlyForecast ||
            forecast.weeklyForecastChart
          ) {
            const hourlyForecast =
              forecast.hourlyForecast && forecast.hourlyForecast.length !== 0
                ? forecast.hourlyForecast.slice(0, 12)
                : null;

            const weeklyForecast =
              forecast.weeklyForecast && forecast.weeklyForecast.length !== 0
                ? forecast.weeklyForecast
                : null;

            const weeklyForecastChart =
              forecast.weeklyForecastChart && forecast.weeklyForecastChart.length !== 0
                ? forecast.weeklyForecastChart
                : null;

            const currentWeather = {
              date:
                (hourlyForecast?.[0]?.startTime &&
                  formatDate(hourlyForecast[0]?.startTime)) ??
                formatAsLocalDate(new Date()),
              shortForecast: hourlyForecast
                ? (hourlyForecast[0]?.shortForecast ?? 'No forecast available')
                : 'No forecast available',
              longForecast: weeklyForecast
                ? (weeklyForecast[0]?.day.detailedForecast ?? 'No forecast available')
                : 'No forecast available',
              temperature:
                hourlyForecast?.[0]?.temperature !== undefined
                  ? typeof hourlyForecast[0]?.temperature === 'number'
                    ? hourlyForecast[0]?.temperature
                    : hourlyForecast[0]?.temperature?.value
                  : null,
              highTemperature:
                weeklyForecast?.[0]?.day?.temperature !== undefined
                  ? typeof weeklyForecast?.[0]?.day?.temperature === 'number'
                    ? weeklyForecast?.[0]?.day?.temperature
                    : weeklyForecast?.[0]?.day?.temperature.value
                  : null,
              lowTemperature:
                weeklyForecast?.[0]?.night?.temperature !== undefined
                  ? typeof weeklyForecast?.[0]?.night?.temperature === 'number'
                    ? weeklyForecast?.[0]?.night?.temperature
                    : weeklyForecast?.[0]?.night?.temperature.value
                  : null,
              windSpeed:
                hourlyForecast && typeof hourlyForecast[0]?.windSpeed === 'string'
                  ? hourlyForecast[0]?.windSpeed
                  : null,
              windDirection: hourlyForecast
                ? (hourlyForecast[0]?.windDirection ?? null)
                : null,
              humidity: hourlyForecast
                ? (hourlyForecast[0]?.relativeHumidity?.value ?? null)
                : null,
              rainChance: hourlyForecast
                ? (hourlyForecast[0]?.probabilityOfPrecipitation?.value ?? null)
                : null,
            };

            return {
              currentWeather: currentWeather,
              hourlyForecast: hourlyForecast,
              weeklyForecast: weeklyForecast,
              weeklyForecastChart: weeklyForecastChart,
              alertZones: forecastZones,
            };
          }
        } catch (error) {
          console.error('ERROR FETCHING WEATHER:', error);
        }
        attempts++;
        if (attempts >= input.maxRetries) {
          console.error('MAX RETRIES REACHED: getAllWeather');
          return null;
        }
        console.warn(`Retrying (${attempts}/${input.maxRetries})`);
      }
    }),
});
