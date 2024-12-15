// import Footer from "./_components/Footer";
// import Header from "./_components/Header";

import InputLocation from '~/app/(main)/_components/InputLocation';

export default async function Home() {
  return (
    <main className="flex size-full grow flex-col items-center justify-around bg-yellow-200 font-mono text-gray-600">
      {/* <Header /> */}
      {/* Content */}
      <div className="flex w-full flex-col items-center">
        <div className="my-12 flex grow flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl">weatherflame</h1>
          <div className="mt-3">
            <h5 className="text-center font-light italic md:text-lg">
              &quot;where the forecasts are hot...
            </h5>
            <h5 className="text-center font-light italic md:text-lg">
              and maybe accurate&quot;
            </h5>
          </div>
          <div className="mt-10">
            <InputLocation className="flex flex-row space-x-3" />
          </div>
        </div>
        <div className="item m-6 max-w-sm rounded-md bg-black/10 p-6 md:max-w-xl">
          <h5 className="text-lg md:text-xl">Disclaimer:</h5>
          <p className="mt-2 text-xs md:text-sm">
            This is a passion project built by a curious new developer diving headfirst
            into React, Next.js, Tailwind, public APIs and more. While Weatherflame
            strives to deliver fun and functionality, please don’t use it to plan your
            wedding, your apocalypse survival strategy, or a picnic under the stars.
          </p>
          <p className="md:text:sm mt-2 text-xs font-semibold">
            Accuracy is a bonus, not a guarantee. Proceed with humor and low expectations.
          </p>
        </div>
      </div>
      {/* <Footer /> */}
    </main>
  );
}
