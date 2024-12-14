'use client';

import { useState } from 'react';

import { api } from '~/trpc/client';

export default function WeatherDisplay({ lat, lon }: { lat: number; lon: number }) {
  const [geo, setGeo] = useState<{ lat: number; lon: number }>({ lat: lat, lon: lon });

  const weatherData = api.weather.getWeatherByPoint.useQuery({
    point: `${geo.lat},${geo.lon}`,
  });

  console.log('WEATHER DATA', weatherData.data);

  return (
    <div className="max-w-full border border-black p-3">
      <h1 className="text-xl">WEATHER COMPONENT</h1>
      <div>
        {weatherData.isLoading && <div>...loading</div>}
        {weatherData.data && (
          <div className="flex flex-col">
            {weatherData.data.map((weather) => (
              <div
                className="m-2 flex flex-col border border-black p-2"
                key={weather.number}
              >
                <p>{weather.name}</p>
                <p>{weather.detailedForecast}</p>
                <p>{typeof weather.temperature?.toString()}</p>
                <p>{weather.windSpeed?.toString()}</p>
                <p>{weather.windDirection?.toString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
