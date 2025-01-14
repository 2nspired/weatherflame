// TODO: CHECK FOR HYDRATION ERRORS

import React from 'react';

import InputLocation from '~/app/(main)/_components/InputLocation';
import SectionContainer from '~/app/(main)/_components/SectionContainer';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export default async function Home() {
  return (
    <div className="flex size-full flex-col items-center bg-zinc-200">
      {/* MAIN CONTAINER */}
      <SectionContainer className="min-h-10 border-black bg-zinc-700 text-center"></SectionContainer>
      <div className="z-10 flex size-full flex-col items-center justify-center">
        {/* TITLE AND SUBTITLE */}

        <div className="flex w-full grow flex-col items-center justify-center border-b border-black bg-zinc-700">
          <div className="flex size-full flex-col border-b border-black">
            <div className="flex size-full flex-col items-center justify-center px-3">
              <div className="size-full max-w-6xl border-x border-black"></div>
            </div>
          </div>
          {/* CONTENT CONTAINER */}
          <div className="flex w-full justify-center px-3">
            <div className="flex w-full max-w-6xl flex-row">
              <div className="flex grow flex-col border-x border-black">
                <div className="flex flex-col border-b border-black px-6 font-mono text-[3rem] text-gray-200 sm:flex-row lg:text-[7rem]">
                  <div className="h-12">WEATHER</div>
                  <div>FLAME</div>
                </div>
                <div className="flex h-16 items-center border-b border-black font-light text-gray-200">
                  <div className="px-6">
                    Where the forecasts are hot, and mostly accurate.
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="h-24">
                    <InputLocation className="flex space-x-3 p-6 pb-7 sm:flex-row" />
                  </div>
                </div>
              </div>
              <div className="hidden w-2/6 border-r border-black sm:block"></div>
            </div>
          </div>
          <div className="flex size-full flex-col border-t border-black px-3">
            <div className="flex size-full flex-col items-center justify-center">
              <div className="size-full max-w-6xl border-x border-black"></div>
            </div>
          </div>
        </div>

        {/* SPACE CONTAINER */}
        <SectionContainer className="h-12 border-b border-black text-center md:h-20"></SectionContainer>
        {/* SECTION 1 CONTAINER */}
        <div className="flex w-full flex-col items-center justify-center px-3">
          <div className="w-full max-w-6xl border-x border-black">
            <Alert className="rounded-none border-hidden bg-black/10 p-6 text-gray-800">
              <AlertTitle className="pb-3">DISCLAIMER</AlertTitle>
              <AlertDescription>
                <div>
                  While Weatherflame strives to deliver fun and functionality, please
                  don&apos;t use it to plan your wedding, your apocalypse survival
                  strategy, or a picnic under the stars.
                </div>
                <br />
                <div>
                  This is a personal development project designed as part of an ongoing
                  journey to deepen coding knowledge. It's a work in progress.
                  <br />
                  <br />
                  See{' '}
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
        <SectionContainer className="min-h-12 border-t border-black text-center"></SectionContainer>
      </div>
    </div>
  );
}
