import type { paths } from "../app/types/weatherGov.d.ts";

import createClient from "openapi-fetch";

export const fetchClient = createClient<paths, "application/geo+json">({
  baseUrl: "https://api.weather.gov",
  headers: {
    "User-Agent": "weatherflame.com, thomastrudzinski@gmail.com",
    host: "api.weather.gov",
    accept: "application/geo+json",
  },
});
