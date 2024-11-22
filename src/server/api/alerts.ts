import type { paths, components } from "~/app/types/weatherGov.d.ts";
import createClient from "openapi-fetch";

// TYPES
// --------------------------------------------------------------

type WeatherAlertParams = paths["/alerts/active"]["get"]["parameters"]["query"];

type AlertType = components["schemas"]["Alert"];

type AlertFeatureType =
  components["responses"]["AlertCollection"]["content"]["application/geo+json"]["features"];

//  REQUESTS
// --------------------------------------------------------------

export const fetchClient = createClient<paths, "application/geo+json">({
  baseUrl: "https://api.weather.gov",
  headers: {
    "User-Agent": "weatherflame.com, thomastrudzinski@gmail.com",
    host: "api.weather.gov",
    accept: "application/geo+json",
  },
});

export async function fetchWeatherAlerts(params: WeatherAlertParams) {
  try {
    const { response, data, error } = await fetchClient.GET("/alerts/active", {
      params: {
        query: {
          ...params,
        },
      },
    });

    if (response.status === 200 && data && data.features.length > 0) {
      return data.features;
    } else if (response.status !== 200 || !data || data.features.length === 0) {
      console.log("No alerts found", error);
      return [];
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
