import React from 'react';

import InputLocation from '~/app/(main)/_components/InputLocation';
import SectionContainer from '~/app/(main)/_components/SectionContainer';
import TypewriterText from '~/app/(main)/_components/TextAnimations';

import Disclaimer from './_components/Disclaimer';

export default async function Home() {
  return (
    <div className="flex size-full flex-col items-center border-b border-black bg-zinc-700">
      <SectionContainer className="mt-3 flex grow flex-col items-center justify-center border-t border-black">
        <div className="h-6"></div>
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
              <div className="animate-fade-in border-b border-black px-6 py-3 font-light opacity-0 delay-700">
                Where the forecasts are hot, and mostly accurate.
              </div>
              <div>
                <div className="animate-fade-in h-28 opacity-0 delay-1000">
                  <InputLocation
                    enableUserLocation={true}
                    className="flex h-full space-x-3 p-6 pb-7 sm:flex-row"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="h-6 bg-zinc-700 text-center"></SectionContainer>
      <Disclaimer />
    </div>
  );
}
