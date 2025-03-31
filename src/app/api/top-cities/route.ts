import { NextResponse, type NextRequest } from 'next/server';

import { api } from '~/trpc/server';
import { routeGuard } from '~/utilities/guard/guard';
import { db } from '~/utilities/prisma';

const currentForecast = api.forecasts.getCurrentForecast;
const weeklyForecast = api.forecasts.getWeeklyForecast;
export const dynamic = 'force-dynamic';

const updateWeather = async () => {
  // 1. FETCH LIST OF TOP CITIES TO DISPLAY

  try {
    const topCities = await db.cities.findMany({
      where: {
        display: true,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        state: true,
        lat: true,
        lng: true,
        slug: true,
      },
      take: 1,
    });

    if (!topCities || topCities.length === 0) {
      console.error('No top cities found');
      return;
    }

    const totalCities = topCities.length;
    let updatedCities = 0;

    // 2. GET CURRENT FORECAST

    for (const city of topCities) {
      const currentForecastData = await currentForecast({
        lat: city.lat,
        lng: city.lng,
      });

      console.log('CURRENT FORECAST DATA', currentForecastData);

      if (!currentForecastData) {
        console.error(
          'Failed to get current forecast data for city:',
          city.name,
          city.state,
        );
        continue;
      }

      const weeklyForecastData = await weeklyForecast({
        lat: city.lat,
        lng: city.lng,
      });

      if (!weeklyForecastData) {
        console.error(
          'Failed to get weekly forecast data for city:',
          city.name,
          city.state,
        );
        continue;
      }

      // 3. UPSERT WEATHER DATA FOR EACH CITY INTO THE DATABASE

      const weatherRecord = await db.cityWeather.upsert({
        where: {
          city_id: city.id,
        },
        create: {
          city_id: city.id,
          date: currentForecastData.startTime
            ? new Date(currentForecastData.startTime)
            : new Date(),
          temp: currentForecastData?.temperature,
          high_temp: weeklyForecastData?.[0]?.day.temperature,
          low_temp: weeklyForecastData?.[0]?.night.temperature,
          rain_chance: currentForecastData?.precipitation,
          humidity: currentForecastData?.humidity,
          dew_point: currentForecastData?.dewpoint,
          wind_speed: currentForecastData?.windSpeed,
          wind_direction: currentForecastData?.windDirection,
          short_forecast: currentForecastData?.shortForecast,
        },
        update: {
          date: currentForecastData.startTime
            ? new Date(currentForecastData.startTime)
            : new Date(),
          temp: currentForecastData?.temperature,
          high_temp: weeklyForecastData?.[0]?.day.temperature,
          low_temp: weeklyForecastData?.[0]?.night.temperature,
          rain_chance: currentForecastData?.precipitation,
          humidity: currentForecastData?.humidity,
          dew_point: currentForecastData?.dewpoint,
          wind_speed: currentForecastData?.windSpeed,
          wind_direction: currentForecastData?.windDirection,
          short_forecast: currentForecastData?.shortForecast,
        },
      });

      if (!weatherRecord) {
        console.error('Failed to upsert weather data for city:', city.name, city.state);
        continue;
      }

      if (weatherRecord) {
        updatedCities++;
        console.info(`Updated weather data for city: ${city.name}, ${city.state}`);
        continue;
      }
    }

    console.info(
      `Updated weather data for ${updatedCities} out of ${totalCities} cities`,
    );
    return 'success';
  } catch (error) {
    console.error('ERROR: Failed to upsert cities forecasts  ❌', error);
    return 'error';
  }
};

// CALL ROUTE

export async function GET(request: NextRequest) {
  const handler = routeGuard(request);

  if (handler?.status === 401) {
    return handler;
  }

  const start = Date.now();
  console.log('Seeding database...');

  const status = await updateWeather();

  if (status === 'success') {
    try {
      await db.chronLogs.create({
        data: {
          type: 'forecasts update',
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Failed to create chron log:', error);
    }

    const end = Date.now();
    console.log(`Upserting city forecasts completed in ${end - start}ms`);
    return NextResponse.json(
      {
        success: true,
        message: 'Updating forecasts completed',
      },
      { status: 200 },
    );
  }

  if (status === 'error') {
    try {
      await db.chronLogs.create({
        data: {
          type: 'forecasts update',
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Failed to create chron log:', error);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Updating forecasts failed',
      },
      { status: 500 },
    );
  }
}
