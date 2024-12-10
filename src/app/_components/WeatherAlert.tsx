// import WeatherAlert from '../components/WeatherAlert';
import type { components } from '../types/weather-gov/weatherGov.js';

// import type { components, paths } from '../types/weatherGov.d.ts';

type AlertCollectionResponse =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'];

// ["features"];

// --------------------------------------------------------------
export default function WeatherAlerts(alertsData: AlertCollectionResponse) {
  console.log('ALERTS ALERTS ALERTS PASSED TO COMPONENT ------>', alertsData);
  return (
    <div>
      {alertsData.map((alert) => (
        <div key={alert.properties.id}>
          <h3>{alert.properties.headline}</h3>
          <p>{alert.properties.description}</p>
        </div>
      ))}
    </div>
  );
}
