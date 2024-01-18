


export const weatherKey = process.env.WEATHER_API as string;

export async function getLocation(location: string) {
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${weatherKey}`;
    const res = await fetch(URL);
    const resJson = await res.json();
    console.log("test test test:", resJson);
    return {
      cityName: resJson[0].name,
      country: resJson[0].country,
      state: resJson[0].state,
      lat: resJson[0].lat,
      lon: resJson[0].lon,
    };
  }

  export async function getWeather(location: {
  cityName: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}) {
    const part = "";
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${weatherKey}&units=imperial`;
    console.log(location);
    const res = await fetch(URL);
    const resJson = await res.json();
    console.log(resJson);
    return resJson;
  }
