// fetch client.ts

import createClient from "openapi-fetch";
import type { paths, components } from "~/app/types/weatherGov";
import { fetchWeatherAlerts } from "~/server/api/alerts";
//  TYPES
// --------------------------------------------------------------
type AlertParams = paths["/alerts/active"]["get"]["parameters"]["query"];

type Alert = components["schemas"]["Alert"];

type AlertFeatureResponse =
  components["responses"]["AlertCollection"]["content"]["application/geo+json"]["features"];

const AlertPropExclude = [
  "@id",
  "@type",
  "geocode",
  "references",
  "sender",
  "parameters",
  "VTEC",
];

// --------------------------------------------------------------

export default async function Home() {
  const client = createClient<paths, "application/geo+json">({
    baseUrl: "https://api.weather.gov",
    headers: {
      "User-Agent": "weatherflame.com, thomastrudzinski@gmail.com",
      host: "api.weather.gov",
      accept: "application/geo+json",
    },
  });

  const params: AlertParams = {
    status: ["actual"],
    message_type: ["alert"],
    event: [
      "Extreme Fire Danger",
      "Fire Warning",
      "Fire Weather Watch",
      "Extreme Fire Dange",
      "Flood Watch",
    ],
    // code: ["FRW", "HWA", "HWW"],
    limit: 5,
  };

  const alertsData = await fetchWeatherAlerts(params);

  return (
    <main className="flex min-h-screen w-full flex-row bg-red-700">
      {/* Container */}
      <div className="flex-grow border p-10">
        {/* Component */}
        {alertsData &&
          alertsData.length > 0 &&
          alertsData.map((alert) => <Alert key={alert.id} alert={alert} />)}
      </div>
    </main>
  );
}

// Components
// --------------------------------------------------------------

const Alert = ({ alert }: { alert: AlertFeatureResponse[0] }) => {
  const alertProps = alert.properties;
  console.log("ALERT PROPS ------>", alert);

  return (
    <div className="font-mono text-xs text-white">
      {alertProps &&
        Object.keys(alertProps).map((prop) =>
          AlertPropExclude.includes(prop) ? null : (
            <div className="justify- flex flex-row flex-wrap items-center py-1 sm:flex-nowrap">
              <div
                className="pr-1 text-sm font-extrabold"
                key={prop}
              >{`${prop}:`}</div>
              <div className="w-full">{`${alertProps[prop]}`}</div>
            </div>
          ),
        )}
    </div>
  );
};
