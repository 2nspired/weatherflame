import Image from "next/image";
const weatherKey = process.env.WEATHER_API;
async function getWeather(location: {
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

async function getLocation(location: string) {
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

export default async function Location({
  params,
}: {
  params: { location: string };
}) {
  const location = await getLocation(params.location);
  const weather = await getWeather(location);
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="mt-24 rounded p-5 shadow-lg">
        <div className="py-2 text-lg">City: {location.cityName}</div>
        <div className="py-4 text-lg">State: {location.state}</div>
        <div className="py-2 text-sm">
          latitude and longitude: {location.lat}, {location.lon}
        </div>
        <div className="py-6 text-2xl">temperature: {weather.main.temp}</div>
        <div className="py-6 text-2xl">humidity: {weather.main.humidity}</div>
        <div className="py-4 text-base">feels like</div>
        <div className="py-2 text-sm">wind speed</div>
        <div className="py-2 text-base">
          short description: {weather.weather[0].description}
        </div>
      </div>
    </main>
  );
}
