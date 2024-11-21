import createClient from "openapi-fetch";
import type { paths, components } from "../../app/types/weatherGov.js";

// TYPES
// --------------------------------------------------------------

type WeatherAlertParams = paths["/alerts/active"]["get"]["parameters"]["query"];

type AlertType = components["schemas"]["Alert"];

type AlertFeatureType =
  components["responses"]["AlertCollection"]["content"]["application/geo+json"]["features"];

//  REQUESTS
// --------------------------------------------------------------

const client = createClient<paths, "application/geo+json">({
  baseUrl: "https://api.weather.gov",
  headers: {
    "User-Agent": "weatherflame.com, thomastrudzinski@gmail.com",
    host: "api.weather.gov",
    accept: "application/geo+json",
  },
});

export async function fetchWeatherAlerts(params: WeatherAlertParams) {
  try {
    const { response, data, error } = await client.GET("/alerts/active", {
      params: {
        query: {
          ...params,
        },
      },
    });

    if (response.status === 200 && data && data.features.length > 0) {
      return data.features;
    } else {
      console.error(error);
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
