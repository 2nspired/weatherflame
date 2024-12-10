'use client';

// TODO: CLEAN UP IN GENERAL
// TODO: TRPC IS NOT RETURNING ALERTS, SOMETHING WITH NOT FEEDING IT INITIAL DATA from PAGE I THINK.
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import BreadcrumbRoute from '~/app/experiments/_components/BreadcrumbRoute';
import type { components } from '~/app/types/weather-gov/weatherGov';
// import type { components, paths } from '~/app/types/weather-gov/weatherGov';
import { type TRPCInputs } from '~/server/api/root';
// import { type TRPCInputs, type TRPCOutputs } from '~/server/api/root';
import { api } from '~/trpc/client';

type AlertParams = TRPCInputs['alerts']['getAlerts'];

export type Alert = components['schemas']['Alert'];

export type AlertFeatureResponse =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'][0];

export default function Alert() {
  // export default function Alert({ data }: { data: Alerts }) {
  const searchParams = useSearchParams();
  const countyZone = searchParams.get('county');
  const fireZone = searchParams.get('fire');
  const publicZone = searchParams.get('public');
  const zoneTest = searchParams.get('zoneTest');

  const zones =
    [countyZone, fireZone, publicZone, zoneTest].filter(
      (zone): zone is string => zone !== null,
    ) ?? [];

  const [alertParams, setAlertParams] = useState<AlertParams>({
    zone: zones,
  });

  console.log(setAlertParams);

  const clientTRPC = api.alerts.getAlerts.useQuery(alertParams, {
    enabled: zones.length > 0,
  });

  console.log('clientTRPC', clientTRPC?.data);

  console.log('alertParams', alertParams);

  return (
    <div className="flex flex-col space-y-3">
      <h1 className="text-xl">alert component</h1>
      <h1 className="text-xl">
        <BreadcrumbRoute />
      </h1>
      <p>{`countyZone: ${searchParams.get('county')}`}</p>
      <p>{`fireZone: ${searchParams.get('fire')}`}</p>
      <p>{`publicZone: ${searchParams.get('public')}`}</p>
      <p>{`name: ${searchParams.get('name')}`}</p>
      <p>{`state: ${searchParams.get('state')}`}</p>
      <p>{`country: ${searchParams.get('country')}`}</p>
      <p>{`zip: ${searchParams.get('zip')}`}</p>
      <p>{`lat: ${searchParams.get('lat')}`}</p>
      <p>{`lon: ${searchParams.get('lon')}`}</p>
      <p>{`zoneTest: ${searchParams.get('zonetest')}`}</p>
      {clientTRPC && clientTRPC.data && clientTRPC.data.length > 0 ? (
        clientTRPC.data.map((alert: AlertFeatureResponse) => (
          <div key={alert.id}>
            <p>{alert.properties.id}</p>
            <p>{alert.properties.headline}</p>
            <p>{alert.properties.description}</p>
            <p>{alert.properties.affectedZones}</p>
          </div>
        ))
      ) : (
        <div>No alerts</div>
      )}
    </div>
  );
}
