import Link from 'next/link';

import InputLocation from '~/app/(main)/_components/InputLocation';
import SectionContainer from '~/app/(main)/_components/SectionContainer';

export default function WeatherHeader() {
  return (
    <SectionContainer className="border-y border-black">
      <div className="flex w-full flex-row">
        <div className="hidden shrink-0 border-r border-black px-6 font-mono sm:flex sm:flex-col sm:justify-center sm:text-3xl">
          <Link href="/">
            <div>WEATHERFLAME</div>
            <div className="text-xs">pretty accurate weather</div>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-black font-mono text-3xl sm:hidden">
          <Link href="/">
            <div className="px-8">WF°</div>
          </Link>
        </div>

        <div className="flex h-32 w-full flex-row items-start justify-end p-6 pt-10">
          <InputLocation
            className="flex flex-row space-x-2"
            buttonClassName="hidden lg:block"
            enableUserLocation={false}
          />
        </div>
      </div>
    </SectionContainer>
  );
}
