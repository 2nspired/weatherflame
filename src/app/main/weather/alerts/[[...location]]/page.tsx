import { api } from 'src/trpc/server';

import AlertsDisplay from '~/app/main/weather/alerts/_components/AlertsDisplay';

export default async function Alerts({
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

  console.log('ROUTE PARAMS', routeParams);
  console.log('LOCATION PARAM', locationParam);

  const getZipData = async () => {
    if (!locationParam || locationParam.length === 0 || isNaN(Number(locationParam))) {
      return null;
    }

    const zipData = await api.location.getGeoByZip({
      zip: locationParam,
      countryCode: 'US',
    });

    return zipData;
  };

  const zipData = await getZipData();

  const getWeatherData = async () => {
    if (!zipData?.lat || !zipData?.lon) {
      console.error('Invalid zip data');
      return null;
    }
    const weatherData = await api.weather.getWeatherByPoint({
      point: `${zipData.lat},${zipData.lon}`,
    });
    return weatherData;
  };

  const weatherData = await getWeatherData();

  const getZoneData = async () => {
    if (!zipData?.lat || !zipData?.lon) {
      console.error('Invalid zip data');
      return null;
    }

    const zoneData = await api.location.getZoneByGeo({
      lat: zipData.lat.toString(),
      lon: zipData.lon.toString(),
    });
    return zoneData;
  };

  const zoneData = await getZoneData();

  const getAlertData = async () => {
    if (!zoneData?.features) {
      console.error('Invalid zone data');
      return null;
    }

    const zoneCodes = zoneData.features.map((zone) => zone.properties.id);

    const alertData = await api.alerts.getAlerts({
      zone: zoneCodes,
    });
    return alertData;
  };

  const alertData = await getAlertData();

  console.log('ZIP DATA', zipData);
  console.log('WEATHER DATA', weatherData);
  console.log('ZONE DATA', zoneData);
  console.log('ALERT DATA', alertData);

  const prefetchedData = {
    zipData,
    weatherData,
    zoneData,
    alertData,
  };

  if (!prefetchedData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div>
        {alertData && (
          <AlertsDisplay
            zones={zoneData?.features?.map((zone) => zone.properties.id) ?? []}
            prefetchedData={alertData}
          />
        )}
      </div>
    </div>
  );
}
