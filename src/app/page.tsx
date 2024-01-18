import { getLocation } from "./utils";
import { getWeather } from "./utils";
import Image from "next/image";

export default async function Home() {
  const location = await getLocation("Honolulu");
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
