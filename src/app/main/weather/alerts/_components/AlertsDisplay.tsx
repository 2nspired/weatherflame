'use client';

// TODO: CLEAN UP IN GENERAL
import { useState } from 'react';

import type { components } from '~/app/types/weather-gov/weatherGov';
import { type TRPCInputs } from '~/server/api/root';
import { api } from '~/trpc/client';

type AlertParams = TRPCInputs['alerts']['getAlerts'];
// type Alert = components['schemas']['Alert'];
// type AlertFeatureResponse =
//   | components['responses']['AlertCollection']['content']['application/geo+json']['features']
//   | [];
type AlertFeature =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'][0];

// --------------------------------------------------------

export default function AlertsDisplay({ zones }: { zones: string[] }) {
  const [alertParams, setAlertParams] = useState<AlertParams>({
    zone: zones,
  });

  console.log('alertParams', alertParams);

  const alertsData = api.alerts.getAlerts.useQuery({
    ...alertParams,
  });

  return (
    <div className="flex flex-col space-y-3">
      <h1 className="text-xl">ALERTS COMPONENT</h1>
      <h1 className="text-xl"></h1>
      <div className="max-w-full border border-black p-3">
        {alertsData && alertsData.data && alertsData.data.length > 0 ? (
          alertsData.data.map((alert: AlertFeature) => (
            <div className="flex max-w-full flex-col space-y-2" key={alert.id}>
              <p>{alert.properties.id}</p>
              <p>{alert.properties.headline}</p>
              <p>{alert.properties.description}</p>
              <p className="break-words">{alert.properties.affectedZones}</p>
            </div>
          ))
        ) : (
          <div>No alerts</div>
        )}
      </div>
    </div>
  );
}
