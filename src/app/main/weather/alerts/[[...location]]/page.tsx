import { api } from 'src/trpc/server';

import WeatherDisplay from '~/app/main/weather/alerts/_components/WeatherDisplay';

import AlertsDisplay from '../_components/AlertsDisplay';

export default async function AlertsPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const routeParams = await params;

  if (!routeParams.location || routeParams.location.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }

  const locationParam = routeParams.location.slice(-1)[0];

  // console.log('ROUTE PARAMS', routeParams);
  // console.log('LOCATION PARAM', locationParam);

  const getZipData = async () => {
    if (!locationParam || locationParam.length === 0 || isNaN(Number(locationParam))) {
      return null;
    }
    return await api.location.getGeoByZip({
      zip: locationParam,
      countryCode: 'US',
    });
  };

  const zipData = await getZipData();

  const getAlertZones = async () => {
    if (!zipData?.lat || !zipData?.lon) {
      console.error('Invalid zip data');
      return null;
    }

    return await api.location.getZoneByGeo({
      lat: zipData.lat.toString(),
      lon: zipData.lon.toString(),
    });
  };

  const alertZonesData = await getAlertZones();
  const alertZones = alertZonesData?.features?.map((zone) => zone.properties.id) ?? [];

  return (
    <div className="p-6">
      <div>
        <div>
          {zipData && (
            <div>
              <WeatherDisplay lat={zipData.lat} lon={zipData.lon} />
              <AlertsDisplay zones={alertZones} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
