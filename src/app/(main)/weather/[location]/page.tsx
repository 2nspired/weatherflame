// const weatherKey = process.env.WEATHER_API;

export default function Location() {
  return <div>Location - being reworked</div>;
}

// async function getWeather(location: {
//   cityName: string;
//   country: string;
//   state: string;
//   lat: number;
//   lon: number;
// }) {
//   const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${weatherKey}&units=imperial`;
//   const res = await fetch(URL);
//   const resJson = await res.json();
//   return resJson;
// }

// async function getLocation(location: string) {
//   const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${weatherKey}`;
//   const res = await fetch(URL);
//   const resJson = await res.json();
//   return {
//     cityName: resJson[0].name,
//     country: resJson[0].country,
//     state: resJson[0].state,
//     lat: resJson[0].lat,
//     lon: resJson[0].lon,
//   };
// }

// interface LocationProps {
//   params: {
//     location: string;
//   };
// }

// export default async function Location({ params }: LocationProps) {
//   const location = await getLocation(params.location);
//   const weather = await getWeather(location);
//   return (
//     <main className="flex flex-col items-center justify-between">
//       <div className="mt-24 rounded p-5 shadow-lg">
//         <div className="py-2 text-lg">City: {location.cityName}</div>
//         <div className="py-4 text-lg">State: {location.state}</div>
//         <div className="py-2 text-sm">Temperature: {weather.main.temp}°F</div>
//       </div>
//     </main>
//   );
// }
