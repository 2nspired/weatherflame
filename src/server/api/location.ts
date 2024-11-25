// Geocoding API - OpenWeatherMap: https://openweathermap.org/api/geocoding-api

// TYPES
// --------------------------------------------------------------

// BY ZIP
type GeoLocateByZipParams = {
  zip: string;
  countryCode: string; // ISO 3166-1 alpha-2
  limit?: number;
};
interface LocationByZip {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

// BY NAME

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

// REQUESTS
// --------------------------------------------------------------

export const weatherKey = process.env.WEATHER_API as string;

export async function getLocationByZip(params: GeoLocateByZipParams) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${params.zip},${params.countryCode}&appid=${weatherKey}`;
  // console.log("LOCATION BY ZIP URL ------------>>>>>>>", url);

  try {
    const res = await fetch(url);
    console.log("ZIP RESPONSE ----->>>> 11111", res);
    const resJson: LocationByZip = await res.json();
    if (res.ok && resJson) {
      return resJson;
    } else {
      console.error("LOCATION BY ZIP RESPONSE ERROR", res, resJson);
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getLocationByName(params: GeoLocateByName) {
  const city = params.city.replace(" ", "+");

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${params.stateCode},${params.countryCode}&appid=${weatherKey}`;
  // console.log("LOCATION BY NAME URL --------->>>>>>>", url);

  try {
    const res = await fetch(url);
    const resJson: LocationByName[] = await res.json();
    if (res.ok && resJson.length > 0) {
      return resJson[0];
    } else {
      console.error("LOCATION BY NAME RESPONSE ERROR", res, resJson);
      return [];
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
