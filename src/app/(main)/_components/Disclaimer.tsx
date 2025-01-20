'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '~/components/ui/alert';

import SectionContainer from './SectionContainer';

export default function Disclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative flex w-full justify-center">
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="absolute -top-6 flex items-center justify-center border border-black bg-zinc-500"
        >
          <div className="flex size-full items-center justify-center space-x-1 pl-4 pr-3 text-zinc-100">
            <div className="font-mono text-sm tracking-wide">readme</div>
            {showDisclaimer ? <ChevronDown size={28} /> : <ChevronUp size={28} />}
          </div>
        </button>
      </div>
      {/* Expandable Container */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          showDisclaimer ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <SectionContainer className="h-6 w-full border-b border-black text-center"></SectionContainer>
        <div className="flex w-full flex-col items-center justify-center px-3">
          <div className="w-full max-w-6xl border-x border-black">
            <Alert className="rounded-none border-hidden bg-black/10 p-6 text-gray-800">
              <AlertDescription>
                <div>
                  While Weatherflame strives to deliver fun and functionality, please
                  don&apos;t use it to plan your wedding, apocalypse survival strategy, or
                  a picnic under the stars.
                </div>
                <br />
                <div>
                  This is a personal development project designed as part of an ongoing
                  journey to deepen coding knowledge and test new libraries and
                  integrations. See{' '}
                  <a
                    className="underline"
                    href="https://github.com/2nspired/weatherflame"
                    target="_blank"
                  >
                    github
                  </a>{' '}
                  for more info.
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <SectionContainer className="h-12 border-t border-black text-center"></SectionContainer>
      </div>
    </div>
  );
}
