import { api } from 'src/trpc/server';

import WeatherDisplay from '~/app/(main)/_components/WeatherDisplay';
import BreadcrumbRoute from '~/app/experiments/_components/BreadcrumbRoute';

import AlertsDisplay from '../../../_components/AlertsDisplay';

export default async function AlertsPage({
  params,
}: {
  params: Promise<{ location: string[] }>;
}) {
  const routeParams = await params;

  if (!routeParams.location || routeParams.location.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }
  // FIXME: Fix this, if the last level of an array is not available.
  const locationParam = routeParams.location.slice(-1)[0];
  console.log('PARAMS', routeParams);
  console.log('LOCATION PARAM', locationParam);

  if (!locationParam || locationParam.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }

  const getGeoData = async () => {
    if (!locationParam || locationParam.length === 0) {
      return null;
    }
    if (
      typeof locationParam === 'string' &&
      locationParam.length === 5 &&
      !isNaN(Number(locationParam))
    ) {
      return await api.location.getGeoByZip({
        zip: locationParam,
      });
    }

    // FIXME: NEED VALIDATION FOR LOCATION NAME PARAM - OR TO IGNORE IF ROUTEPARAMS.LENGTH < 4
    if (
      typeof locationParam === 'string' &&
      locationParam.length !== 0 &&
      isNaN(Number(locationParam))
    ) {
      const nameData = await api.location.getGeoByName({
        name: locationParam,
        countryCode: 'US',
      });
      return nameData?.[0] ?? null;
    }
  };

  const geoData = await getGeoData();

  const getAlertZones = async () => {
    if (!geoData?.lat || !geoData?.lon) {
      return null;
    }

    return await api.location.getZoneByGeo({
      lat: geoData.lat.toString(),
      lon: geoData.lon.toString(),
    });
  };

  const alertZonesData = await getAlertZones();
  const alertZones = alertZonesData?.features?.map((zone) => zone.properties.id) ?? [];

  return (
    <div className="p-6">
      <BreadcrumbRoute />
      <div>
        <div>
          {geoData && (
            <div>
              <WeatherDisplay lat={geoData.lat} lon={geoData.lon} />
              <AlertsDisplay zones={alertZones} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
