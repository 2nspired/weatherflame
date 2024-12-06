// TODO: See if using searchParams makes more sense to use and just have an alerts page that pulls in search params from the url, we don't necessarily need dynamic routes for this. I don't think. We pass the search params at the end of the route and then pull them in on the page. Pass in search params. Can use TRPC to load the initial data.

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

export default async function Home() {
  const params: AlertParams = {
    status: ['actual'],
    message_type: ['alert', 'update'],
    event: [
      'Extreme Fire Danger',
      'Fire Warning',
      'Fire Weather Watch',
      'Extreme Fire Dange',
      'Flood Watch',
      'Flood Warning',
    ],
    // code: ["FRW", "HWA", "HWW"],
    limit: 5,
  };

  const alertsData = await fetchWeatherAlerts(params);
  return (
    <main className="flex min-h-screen w-full flex-col bg-violet-600 text-white md:p-10">
      {/* Container */}
      <div className="w-full max-w-4xl">
        <h1 className="font-bold">ALERTS LANDING ALL</h1>
        {/* Component */}
        {alertsData &&
          alertsData.length > 0 &&
          alertsData.map((alert) => (
            <div key={alert.id} className="my-4 border p-3">
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

  return (
    <div className="w-full text-xs">
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
  );
};
