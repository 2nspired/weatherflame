import {
  CloudDrizzle,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Haze,
  Sun,
} from 'lucide-react';

type IconMapping = Record<string, JSX.Element>;

const iconMapping: IconMapping = {
  'scattered rain showers': <CloudSunRain size={24} />,
  'isolated rain showers': <CloudSunRain size={24} />,
  'rain showers': <CloudRain size={24} />,
  sunny: <Sun size={24} />,
  'mostly sunny': <CloudSun size={24} />,
  'partly sunny': <CloudSun size={24} />,
  'partly cloudy': <CloudSun size={24} />,
  cloudy: <Cloudy size={24} />,
  'mostly cloudy': <Cloudy size={24} />,
  drizzle: <CloudDrizzle size={24} />,
  snow: <CloudSnow size={24} />,
  hail: <CloudHail size={24} />,
  thunderstorm: <CloudLightning size={24} />,
  haze: <Haze size={24} />,
};

export default function WeatherIcon({ shortForecast }: { shortForecast: string }) {
  const forecastLower = shortForecast.toLowerCase();
  const icon = Object.keys(iconMapping).find((key) => forecastLower.includes(key));

  return icon ? iconMapping[icon] : <Cloudy size={24} />;
}
