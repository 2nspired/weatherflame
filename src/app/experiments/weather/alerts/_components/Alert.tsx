'use client';

// TODO: CLEAN UP IN GENERAL
import { useState } from 'react';

import BreadcrumbRoute from '~/app/experiments/_components/BreadcrumbRoute';
import type { components } from '~/app/types/weather-gov/weatherGov';
import { type TRPCInputs } from '~/server/api/root';
import { api } from '~/trpc/client';

type AlertParams = TRPCInputs['alerts']['getAlerts'];

export type Alert = components['schemas']['Alert'];

export type AlertFeatureResponse =
  | components['responses']['AlertCollection']['content']['application/geo+json']['features']
  | [];

export type AlertFeature =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'][0];

export default function Alert({
  prefetchedData,
  zones,
}: {
  prefetchedData: AlertFeatureResponse;
  zones: string[];
}) {
  const [alertParams, setAlertParams] = useState<AlertParams>({
    zone: zones,
  });

  console.log(setAlertParams);

  const clientTRPC = api.alerts.getAlerts.useQuery(alertParams, {
    enabled: zones.length > 0,
    initialData: prefetchedData,
  });

  console.log('clientTRPC', clientTRPC?.data);

  console.log('alertParams', alertParams);

  return (
    <div className="flex flex-col space-y-3">
      <h1 className="text-xl">alert component</h1>
      <h1 className="text-xl">
        <BreadcrumbRoute />
      </h1>
      <div className="max-w-full border border-black p-3">
        {clientTRPC && clientTRPC.data && clientTRPC.data.length > 0 ? (
          clientTRPC.data.map((alert: AlertFeature) => (
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
