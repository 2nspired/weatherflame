// TODO: CHECK FOR HYDRATION ERRORS

import React from 'react';

import InputLocation from '~/app/(main)/_components/InputLocation';
import SectionContainer from '~/app/(main)/_components/SectionContainer';
import TypewriterText from '~/app/(main)/_components/TextAnimations';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export default async function Home() {
  return (
    <div className="flex size-full flex-col items-center border-b border-black bg-zinc-200">
      <SectionContainer className="flex grow flex-col items-center justify-center bg-zinc-700">
        {/* CONTENT CONTAINER */}
        <div className="flex size-full flex-col justify-center">
          {/* CONTENT */}
          <div className="flex w-full flex-col sm:flex-row">
            <div className="w-2/6">
              <div className="animate-fade-expand hidden w-2/6 items-center justify-center border-y border-black bg-[#FF6100] text-zinc-100 sm:flex">
                <TypewriterText
                  text="WF°"
                  className="-mr-2 flex items-center font-mono text-[4rem] leading-none md:text-[5rem] lg:text-[7rem]"
                />
              </div>
            </div>
            <div className="animate-fade-in w-full border-y border-l-0 border-black text-zinc-100 opacity-0 delay-500 sm:border-l">
              <div className="animate-fade-in border-b border-black p-6 opacity-0 delay-500">
                <div className="animate-fade-in flex flex-row flex-wrap items-center font-mono text-[4rem] leading-none opacity-0 delay-500 md:text-[4rem] lg:text-[6rem]">
                  <TypewriterText speed={0.05} text="WEATHER" />
                  <TypewriterText speed={0.05} timeDelay={0.3} text="FLAME" />
                </div>
              </div>
              {/* <div className="border-b border-black p-6">
                <div className="flex flex-row flex-wrap items-center font-mono text-[4rem] leading-none md:text-[4rem] lg:text-[6rem]">
                  <TypewriterText speed={0.05} text="WEATHER" />
                  <TypewriterText speed={0.05} timeDelay={0.3} text="FLAME" />
                </div>
              </div> */}
              <div className="animate-fade-in border-b border-black px-6 py-3 font-light opacity-0 delay-700">
                Where the forecasts are hot, and mostly accurate.
              </div>
              <div>
                <div className="animate-fade-in h-24 opacity-0 delay-1000">
                  <InputLocation className="flex space-x-3 p-6 pb-7 sm:flex-row" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="h-6 border-b border-black bg-zinc-700 text-center">
        {/* <div className="w-full border-t border-black"></div> */}
      </SectionContainer>

      {/* <SectionContainer className="h-6 border-b border-black text-center md:h-20"></SectionContainer> */}
      <SectionContainer className="h-6 border-b border-black text-center"></SectionContainer>
      <div className="flex w-full flex-col items-center justify-center px-3">
        <div className="w-full max-w-6xl border-x border-black">
          <Alert className="rounded-none border-hidden bg-black/10 p-6 text-gray-800">
            <AlertTitle className="pb-3">DISCLAIMER</AlertTitle>
            <AlertDescription>
              <div>
                While Weatherflame strives to deliver fun and functionality, please
                don&apos;t use it to plan your wedding, apocalypse survival strategy, or a
                picnic under the stars.
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
  );
}
