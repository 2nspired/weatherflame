import {
  fetchWeatherAlerts,
  type Alert,
  type AlertFeatureResponse,
  type AlertParams,
} from '~/server/api/alerts';

//  TYPES
// --------------------------------------------------------------

const AlertPropExclude = [
  '@id',
  '@type',
  'geocode',
  'references',
  'sender',
  'parameters',
  'VTEC',
];

// --------------------------------------------------------------
// TODO: Will have to figure out how to call based on location. So need to find a way to pull location identifier from geo location.

export const dynamic = 'auto';

export default async function Alerts() {
  const queryParams: AlertParams = {
    // point: params.geo.split('-').join(','),
    status: ['actual'],
    message_type: ['alert', 'update'],
    event: [
      'Winter Storm Warning',
      'Winter Weather Advisory',
      // 'Air Quality Alert',
      // 'Extreme Fire Danger',
      // 'Fire Warning',
      // 'Fire Weather Watch',
      // 'Extreme Fire Dange',
      // 'Flood Watch',
      // 'Flood Warning',
    ],
    // code: ["FRW", "HWA", "HWW"],
    limit: 5,
  };

  const alertsData = await fetchWeatherAlerts(queryParams);
  // console.log('ALERTS DATA ------>', alertsData[0]?.properties);

  return (
    <main className="flex flex-col bg-green-600 p-4 md:p-10">
      <h1 className="font-bold">ALERTS DYNAMIC ROUTE</h1>
      {/* Container */}
      <div className="w-full max-w-4xl">
        {/* Component */}
        {alertsData &&
          alertsData.length > 0 &&
          alertsData.map((alert) => (
            <div key={alert.id} className="my-4 w-full border p-3">
              <Alert alert={alert} />
            </div>
          ))}
      </div>
    </main>
  );
}

// Components
// --------------------------------------------------------------

const Alert = ({ alert }: { alert: AlertFeatureResponse[0] }) => {
  const alertProps = alert.properties;
  // console.log("ALERT PROPS ------>", alert);

  return (
    <main className="min-h-full max-w-full bg-green-500">
      <div className="text-xs text-white">
        {alertProps &&
          Object.keys(alertProps).map((prop) =>
            AlertPropExclude.includes(prop) ? null : (
              <div key={prop} className="items-center py-1">
                <div className="pr-1 text-sm font-extrabold">{`${prop}:`}</div>
                <div className="w-full grow-0 break-words">{`${alertProps[prop]}`}</div>
              </div>
            ),
          )}
      </div>
    </main>
  );
};
