import type { paths, components } from "../../app/types/weatherGov.js";

import { fetchClient } from "../fetchClient.js";

// TYPES
// --------------------------------------------------------------

type WeatherAlertParams = paths["/alerts/active"]["get"]["parameters"]["query"];

type AlertType = components["schemas"]["Alert"];

type AlertFeatureType =
  components["responses"]["AlertCollection"]["content"]["application/geo+json"]["features"];

//  REQUESTS
// --------------------------------------------------------------

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
    } else {
      console.error(error);
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
