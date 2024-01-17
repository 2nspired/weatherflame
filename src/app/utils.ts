// creates a variable string from the API key located in the .env file needed to access the OpenWeather API. 
export const weatherKey = process.env.WEATHER_API as string;

// gets location information
export async function getLocation(location: string, weatherKey:string) {
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

  // gets weather information based on a location obtained from getLocation()
  // move getWeather function to the below 

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