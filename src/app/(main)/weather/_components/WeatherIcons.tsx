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

const smallIconMapping: IconMapping = {
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

const largeIconMapping: IconMapping = {
  'scattered rain showers': <CloudSunRain size={36} />,
  'isolated rain showers': <CloudSunRain size={36} />,
  'rain showers': <CloudRain size={36} />,
  sunny: <Sun size={36} />,
  'mostly sunny': <CloudSun size={36} />,
  'partly sunny': <CloudSun size={36} />,
  'partly cloudy': <CloudSun size={36} />,
  cloudy: <Cloudy size={36} />,
  'mostly cloudy': <Cloudy size={36} />,
  drizzle: <CloudDrizzle size={36} />,
  snow: <CloudSnow size={36} />,
  hail: <CloudHail size={36} />,
  thunderstorm: <CloudLightning size={36} />,
  haze: <Haze size={36} />,
};

export default function WeatherIcon({
  shortForecast,
  size = 24,
}: {
  shortForecast: string;
  size?: 24 | 36;
}) {
  const forecastLower = shortForecast.toLowerCase();
  const iconMapping = size === 24 ? smallIconMapping : largeIconMapping;

  const iconKey = Object.keys(iconMapping).find((key) => forecastLower.includes(key));

  return iconKey ? iconMapping[iconKey] : <Cloudy size={size} />;
}
