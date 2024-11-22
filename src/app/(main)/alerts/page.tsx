// fetch client.ts

import createClient from "openapi-fetch";
import type { paths, components } from "~/app/types/weatherGov";
import { fetchWeatherAlerts } from "~/server/api/alerts";
//  TYPES
// --------------------------------------------------------------
type WeatherAlertParams = paths["/alerts/active"]["get"]["parameters"]["query"];

type AlertType = components["schemas"]["Alert"];

type AlertFeatureType =
  components["responses"]["AlertCollection"]["content"]["application/geo+json"]["features"];

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

  const params: WeatherAlertParams = {
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

  // const { response, data, error } = await client.GET("/alerts/active", {
  //   params: {
  //     query: {
  //       ...params,
  //     },
  //   },
  // });

  const alertsData = await fetchWeatherAlerts(params);

  // const weatherAlerts =
  //   data && data.features ? (data.features as AlertFeatureType) : [];

  // console.log("ALERTS ALERTS ALERTS WEATHER ALERTS ------>", alertsData);

  return (
    <main className="flex min-h-full w-full flex-row bg-red-500/50 bg-slate-500">
      {alertsData.length > 0 ? (
        <div className="flex flex-col space-y-10">
          {alertsData.map((alert) => {
            return (
              <div className="space-y-1.5 p-10" key={alert.id}>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Event:</div>
                  <div>{alert.properties.event}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Area Desc:</div>
                  <div>{alert.properties.areaDesc}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Alert Sent:</div>
                  <div>{alert.properties.sent}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Effective:</div>
                  <div>{alert.properties.effective}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Onset:</div>
                  <div>{alert.properties.onset}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Expires:</div>
                  <div>{alert.properties.expires}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Ends:</div>
                  <div>{alert.properties.ends}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Status:</div>
                  <div>{alert.properties.status}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Message Type:</div>
                  <div>{alert.properties.messageType}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Category:</div>
                  <div>{alert.properties.category}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Severity:</div>
                  <div>{alert.properties.severity}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Certainty:</div>
                  <div>{alert.properties.certainty}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Urgency:</div>
                  <div>{alert.properties.urgency}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Sender:</div>
                  <div>{alert.properties.sender}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Sender Name:</div>
                  <div>{alert.properties.senderName}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Headline:</div>
                  <div>{alert.properties.headline}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Description:</div>
                  <div>{alert.properties.description}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Description:</div>
                  <div>{alert.properties.instruction}</div>
                </div>
                <div className="flex flex-row">
                  <div className="px-2 font-bold">Response:</div>
                  <div>{alert.properties.response}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>Nothing</div>
      )}

      <div className="flex h-full flex-col space-y-10 bg-green-500/50"></div>
    </main>
  );
}
