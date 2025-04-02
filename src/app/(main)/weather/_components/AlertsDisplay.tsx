'use client';

import { CloudAlert } from 'lucide-react';
import { useState } from 'react';

import SectionContainer from '~/app/(main)/_components/SectionContainer';
import type { components } from '~/app/types/weather-gov/weatherGov';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { type TRPCInputs } from '~/server/api/root';
import { api } from '~/trpc/client';
import { formatDayHour } from '~/utilities/formatters/formatDate';

type AlertParams = TRPCInputs['alerts']['getAlerts'];
type AlertFeature =
  components['responses']['AlertCollection']['content']['application/geo+json']['features'][0];

// --------------------------------------------------------

export default function AlertsDisplay({ zones }: { zones: string[] }) {
  const [alertParams] = useState<AlertParams>({
    zone: zones,
  });

  const alertsData = api.alerts.getAlerts.useQuery({
    ...alertParams,
  });

  const alertFeatures = alertsData?.data?.map((alert: AlertFeature) => alert);

  return (
    <>
      {alertsData.data && alertFeatures && alertFeatures.length > 0 && (
        <SectionContainer className="animate-fade-expand border-t border-black bg-red-500 text-white">
          <Accordion type="single" collapsible className="bg-red-500">
            {alertFeatures?.map((alert, index) => (
              <AccordionItem
                key={alert.id}
                value={`index-${index + 1}`}
                className={`border-b-0 px-6 hover:no-underline ${index === alertFeatures.length - 1 ? '' : 'border-b border-black '}`}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-row space-x-2 text-left">
                      <div>
                        <CloudAlert size={24} />
                      </div>
                      <div className="font-bold">
                        {alert.properties.event ?? 'Weather Advisory'}
                      </div>
                    </div>
                    <div className="text-left font-mono text-sm">
                      {alert.properties.effective &&
                        `From ${formatDayHour(alert.properties.effective)}`}
                      {alert.properties.ends &&
                        ` until ${formatDayHour(alert.properties.ends)}`}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="">
                  <div className="flex flex-col space-y-3">
                    {alert.properties.instruction && (
                      <div className="flex flex-col space-y-2">
                        <div className="font-bold">Instruction</div>
                        <div className="font-mono">{alert.properties.instruction}</div>
                      </div>
                    )}
                    {alert.properties.senderName && (
                      <div className="flex flex-col space-y-2">
                        <div className="font-bold">Issued By</div>
                        <div className="font-mono">{alert.properties.senderName}</div>
                      </div>
                    )}
                    {alert.properties.description && (
                      <div className="flex flex-col space-y-2">
                        <div className="font-bold">Description</div>
                        <div className="font-mono">{alert.properties.description}</div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionContainer>
      )}
    </>
  );
}
