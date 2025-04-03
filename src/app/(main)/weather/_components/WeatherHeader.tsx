import Link from 'next/link';

// import InputLocation from '~/app/(main)/_components/InputLocation';
import LocationInput from '~/app/(main)/_components/LocationInput';
import SectionContainer from '~/app/(main)/_components/SectionContainer';

export default function WeatherHeader() {
  return (
    <SectionContainer className="border-y border-black">
      <div className="flex w-full flex-row">
        <div className="group relative hidden shrink-0 border-r border-black font-mono sm:flex sm:flex-col sm:justify-center sm:text-3xl">
          <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
          <Link
            className="z-10 flex size-full flex-col justify-center px-6 transition-colors duration-300 group-hover:text-zinc-900"
            href="/"
          >
            <div>WEATHERFLAME</div>
            <div className="text-xs">pretty accurate weather</div>
          </Link>
        </div>
        <div className="group relative flex flex-col items-center justify-center border-r border-black font-mono text-4xl sm:hidden">
          <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
          <Link
            className="z-10 transition-colors duration-300 group-hover:text-zinc-900"
            href="/"
          >
            <div className="pl-8 pr-6">WF°</div>
          </Link>
        </div>

        <div className="flex h-32 w-full flex-row items-start justify-end p-6 pt-10">
          <LocationInput
            className="flex flex-row space-x-2"
            buttonClassName="hidden lg:block"
            enableUserLocation={false}
          />
          {/* <InputLocation
            className="flex flex-row space-x-2"
            buttonClassName="hidden lg:block"
            enableUserLocation={false}
          /> */}
        </div>
      </div>
    </SectionContainer>
  );
}
