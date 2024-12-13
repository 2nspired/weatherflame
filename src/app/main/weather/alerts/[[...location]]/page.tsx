import { api } from 'src/trpc/server';

export default async function Alerts({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const routeParams = await params;
  const locationParam = routeParams.location.slice(-1)[0];

  console.log('ROUTE PARAMS', routeParams);
  console.log('LOCATION PARAM', locationParam);

  if (!routeParams.location || routeParams.location.length === 0) {
    console.error('Location parameter is missing or invalid');
    return <div>Invalid request. Please check the URL.</div>;
  }

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
  console.log('ZIP DATA', zipData);

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
  console.log('WEATHER DATA', weatherData);

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
  console.log('ZONE DATA', zoneData);

  const getAlertData = async () => {
    if (!zoneData?.features) {
      console.error('Invalid zone data');
      return null;
    }

    const zoneCodes = zoneData.features.map((zone) => zone.properties.id);
    console.log('ZONE CODES', zoneCodes);

    const alertData = await api.alerts.getAlerts({
      zone: zoneCodes,
    });
    return alertData;
  };

  const alertData = await getAlertData();
  console.log('ALERT DATA', alertData);

  return <div>Alerts/[[...zones]] - being reworked</div>;
}

// import {
//   fetchWeatherAlerts,
//   type AlertFeatureResponse,
//   type AlertParams,
// } from '~/server/api/alerts';

// //  TYPES
// // --------------------------------------------------------------

// const AlertPropExclude = [
//   '@id',
//   '@type',
//   'geocode',
//   'references',
//   'sender',
//   'parameters',
//   'VTEC',
// ];

// --------------------------------------------------------------
// TODO: Will have to figure out how to call based on location. So need to find a way to pull location identifier from geo location.

// export const dynamic = 'auto';

// export default async function Alerts() {
//   const queryParams: AlertParams = {
//     // point: params.geo.split('-').join(','),
//     status: ['actual'],
//     message_type: ['alert', 'update'],
//     event: [
//       'Winter Storm Warning',
//       'Winter Weather Advisory',
//       // 'Air Quality Alert',
//       // 'Extreme Fire Danger',
//       // 'Fire Warning',
//       // 'Fire Weather Watch',
//       // 'Extreme Fire Dange',
//       // 'Flood Watch',
//       // 'Flood Warning',
//     ],
//     // code: ["FRW", "HWA", "HWW"],
//     limit: 5,
//   };

//   const alertsData = await fetchWeatherAlerts(queryParams);

//   return (
//     <main className="flex min-h-screen w-full flex-col bg-cyan-500 p-4 md:p-10">
//       {/* Container */}
//       <div className="w-full max-w-4xl">
//         <h1 className="font-bold">ALERTS DYNAMIC ROUTE</h1>
//         {/* Component */}
//         {alertsData &&
//           alertsData.length > 0 &&
//           alertsData.map((alert) => (
//             <div key={alert.id} className="my-4 border border-black p-3">
//               <Alert alert={alert} />
//             </div>
//           ))}
//       </div>
//     </main>
//   );
// }

// // Components
// // --------------------------------------------------------------

// const Alert = ({ alert }: { alert: AlertFeatureResponse[0] }) => {
//   const alertProps = alert.properties;
//   // console.log("ALERT PROPS ------>", alert);

//   return (
//     <main className="min-h-full max-w-full">
//       <div className="text-xs">
//         {alertProps &&
//           Object.keys(alertProps).map((prop) =>
//             AlertPropExclude.includes(prop) ? null : (
//               <div key={prop} className="items-center py-1">
//                 <div className="pr-1 text-sm font-extrabold">{`${prop}:`}</div>
//                 <div className="w-full grow-0 break-words">{`${alertProps[prop]}`}</div>
//               </div>
//             ),
//           )}
//       </div>
//     </main>
//   );
// };
