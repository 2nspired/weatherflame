import { NextResponse, type NextRequest } from 'next/server';

import { type Feature } from '~/server/api/routers/location';
import { api } from '~/trpc/server';
import { routeGuard } from '~/utilities/guard/guard';
import { db } from '~/utilities/prisma';
import slugifyString from '~/utilities/slug/slugify';

import topCities from '../../../../prisma/data/top-cities/topCities.json';

// --------------------------------------------------------------

const getZones = api.location.getZoneByGeo;

const seedCities = async () => {
  const totalCities = topCities.length;
  let upsertedCities = 0;

  try {
    for (const city of topCities) {
      // 1. UPSERT CITY
      const cityRecord = await db.cities.upsert({
        create: {
          name: city.name,
          country: city.country,
          lat: city.lat,
          lng: city.lng,
          state: city.state,
          slug: slugifyString(`${city.name} ${city.state} ${city.country}`),
          display: city.display,
        },
        update: {
          name: city.name,
          country: city.country,
          lat: city.lat,
          lng: city.lng,
          state: city.state,
          display: city.display,
        },
        where: {
          slug: slugifyString(`${city.name} ${city.state} ${city.country}`),
        },
      });

      if (!cityRecord) {
        console.error('Failed to upsert city:', city.name, city.state);
        continue;
      }

      upsertedCities++;

      // 2. GET ZONES
      const zoneData = await getZones({
        lat: city.lat,
        lng: city.lng,
        maxRetries: 1,
      });

      if (!zoneData || zoneData.length === 0) {
        console.error('Failed to get zone data for city:', city.name, city.state);
        continue;
      }

      // 3. UPSERT ZONES

      for (const zone of zoneData) {
        const zoneRecord = await db.alertZones.upsert({
          where: { zone: zone.zone },
          update: {
            type: zone.type,
          },
          create: {
            zone: zone.zone,
            type: zone.type,
          },
        });

        if (!zoneRecord) {
          console.error(`Failed to upsert zone: ${zone.zone}`);
          continue;
        }

        // 4. UPSERT MANY-TO-MANY ZONES TO CITIES
        await db.alertZonesOnCities.upsert({
          where: {
            city_id_alert_zone_id: {
              city_id: cityRecord.id,
              alert_zone_id: zoneRecord.id,
            },
          },
          update: {}, // No updates needed
          create: {
            city_id: cityRecord.id,
            alert_zone_id: zoneRecord.id,
          },
        });
      }
    }

    console.info(`Upserted ${upsertedCities} out of ${totalCities} cities`);
    return 'success';
  } catch (error) {
    console.error('ERROR: Failed to seed cities and zones ❌', error);
    return 'error';
  }
};

// CALL ROUTE

export async function GET(request: NextRequest) {
  const handler = routeGuard(request);

  if (handler) {
    return handler;
  }

  const start = Date.now();
  console.log('Seeding database...');

  const status = await seedCities();

  if (status === 'success') {
    try {
      await db.chronLogs.create({
        data: {
          type: 'seed cities',
          status: 'success',
        },
      });
    } catch (error) {
      console.error('Failed to create chron log:', error);
    }

    const end = Date.now();
    console.log(`Seeding completed in ${end - start}ms`);
    return NextResponse.json({ message: 'Seeding completed' }, { status: 200 });
  }

  if (status === 'error') {
    try {
      await db.chronLogs.create({
        data: {
          type: 'seed cities',
          status: 'error',
        },
      });
    } catch (error) {
      console.error('Failed to create chron log:', error);
    }
    return NextResponse.json({ message: 'Seeding failed' }, { status: 200 });
  }
}
