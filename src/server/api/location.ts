// Geocoding API - OpenWeatherMap: https://openweathermap.org/api/geocoding-api

// TYPES
// --------------------------------------------------------------

type GeoLocateByZipParams = {
  zip: string;
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
interface LocationByZip {
  cityName: string;
  country: string;
  state: string;
  lat: number;
  latRounded: number;
  lon: number;
  lonRounded: number;
}

type GeoLocateByName = {
  city: string;
  stateCode: string; // ISO 3166-1 alpha-2
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
interface LocalNames {
  [key: string]: string | undefined;
  en: string;
}
interface LocationByName {
  name: string;
  local_names: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// --------------------------------------------------------------

export const weatherKey = process.env.WEATHER_API as string;

export async function getLocationByZip(params: GeoLocateByZipParams) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${params.zip},${params.countryCode}&appid=${weatherKey}`;
  console.log(url);

  try {
    const res = await fetch(url);
    const resJson = await res.json();

    return resJson as LocationByZip;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

// TODO: format location if it has a space to replace with a '+'
export async function getLocationByName(params: GeoLocateByName) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${params.city},${params.stateCode}, ${params.countryCode}&appid=${weatherKey}`;

  try {
    const res = await fetch(url);
    const resJson = await res.json();

    return resJson as LocationByName;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
