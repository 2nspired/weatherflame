// TODO: CHECK FOR HYDRATION ERRORS

import React from 'react';

import InputLocation from '~/app/(main)/_components/InputLocation';
import SectionContainer from '~/app/(main)/_components/SectionContainer';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export default async function Home() {
  return (
    <div className="flex size-full flex-col items-center border-b border-black bg-zinc-200">
      <SectionContainer className="flex grow flex-col items-center justify-center bg-zinc-700">
        {/* CONTENT CONTAINER */}
        <div className="flex h-full w-full flex-col justify-center">
          {/* <div className="h-3"></div> */}
          {/* CONTENT */}
          <div className="flex w-full flex-col sm:flex-row">
            <div className="hidden w-2/6 items-center justify-center border-y border-r border-black bg-[#FF6100] text-zinc-100 sm:flex">
              <div className="px-6 pl-12 font-mono text-[4rem] leading-none md:text-[5rem] lg:mr-[-2] lg:text-[10rem]">
                WF°
              </div>
            </div>
            <div className="w-full border-y border-black text-zinc-100">
              <div className="border-b border-black p-6">
                <div className="flex flex-row flex-wrap items-center font-mono text-[4rem] leading-none md:text-[4rem] lg:text-[6rem]">
                  <div className="">WEATHER</div>
                  <div>FLAME</div>
                </div>
              </div>
              <div className="border-b border-black px-6 py-3 font-light">
                Where the forecasts are hot, and mostly accurate.
              </div>
              <div>
                <div className="h-24">
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
                integrations.
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
      <SectionContainer className="h-12 border-t border-black text-center"></SectionContainer>
    </div>
  );
}

{
  /* <div className="flex size-full grow flex-col items-center justify-center bg-zinc-700 px-3">
<div className="flex size-full max-w-6xl flex-col justify-center border-x border-black">
  <div className="flex w-full flex-col sm:flex-row">
    <div className="flex grow flex-col border-y border-black">
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
    <div className="hidden w-2/6 border-y border-l border-black sm:block"></div>
  </div>
</div>
</div> */
}
