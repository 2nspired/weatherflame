'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '~/components/ui/alert';

import SectionContainer from './SectionContainer';

export default function Disclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="flex w-full flex-col items-center bg-zinc-200">
      <div className="relative flex w-full justify-center">
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="absolute -top-5 flex items-center justify-center border border-black bg-pink-500 transition-colors hover:bg-pink-400"
        >
          <div className="flex size-full items-center justify-center space-x-1 pl-4 pr-3 text-black">
            <div className="font-mono text-sm tracking-wide">readme</div>
            {showDisclaimer ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </div>
        </button>
      </div>
      {/* Expandable Container */}
      <div
        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
          showDisclaimer ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <SectionContainer className="h-6 w-full border-b border-black text-center"></SectionContainer>
        <div className="flex w-full flex-col items-center justify-center px-3 landscape:px-12">
          <div className="w-full max-w-6xl border-x border-black">
            <Alert className="rounded-none border-hidden bg-zinc-300 p-6 text-gray-800 landscape:px-12">
              <AlertDescription>
                <div>
                  While Weatherflame strives to deliver fun and functionality, please
                  don&apos;t use it to plan your wedding, apocalypse survival strategy, or
                  a picnic under the stars.
                </div>
                <br />
                <div>
                  This is a personal development project designed as part of an ongoing
                  journey to deepen coding knowledge and to test new patterns, libraries
                  and integrations. See{' '}
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
        <SectionContainer className="h-12 border-t border-black text-center landscape:px-12"></SectionContainer>
      </div>
    </div>
  );
}
