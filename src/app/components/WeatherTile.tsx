import { getLocation } from "../../utilities/utils";
import { getWeather } from "../../utilities/utils";
import { getTime } from "../../utilities/utils";
// import Image from "next/image";
import { getFireWeatherIndex } from "../../utilities/utils";

export default async function WeatherTile() {
  const location = await getLocation("austin");
  const time = await getTime(location.latRounded, location.lonRounded);
  const weather = await getWeather(location);
  // const fireWeatherIndex = await getFireWeatherIndex(location);
  // console.log("fire weather index:", fireWeatherIndex);

  return (
    <main className="flex flex-col items-center justify-between bg-gray-500">
      <div className="my-8 rounded-xl bg-gray-100 p-2 shadow-lg">
        <div className="text-l py-2">country: {location.country}</div>
        <div className="text-l py-2">city: {location.cityName}</div>
        <div className="text-l py-2">state: {location.state}</div>
        <div className="text-l py-2">
          lat and long: {location.lat}, {location.lon}
        </div>
        <div className="text-l py-2">time: {time.time}</div>
        <div className="text-l py-2">date: {time.date}</div>
        <div className="text-l py-2">day of week: {time.dayOfWeek}</div>
        <div className="text-l py-2">temperature: {weather.main.temp}</div>
        <div className="text-l py-2">humidity: {weather.main.humidity}</div>
        <div className="text-l py-2">feels like: {weather.main.feels_like}</div>
        <div className="text-l py-2">wind speed: {weather.wind.speed}</div>
        <div className="text-l py-2">wind deg: {weather.wind.deg}</div>
        <div className="text-l py-2">clouds: {weather.clouds.all}</div>
        <div className="text-l py-2">sunrise: {weather.sys.sunrise}</div>
        <div className="text-l py-2">sunset: {weather.sys.sunset}</div>

        <div className="text-l py-2">
          short description: {weather.weather[0].description}
        </div>
      </div>
    </main>
  );
}
