import InputLocation from '~/app/(main)/_components/InputLocation';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

import Footer from './_components/Footer';

export default async function Home() {
  return (
    <main className="flex size-full flex-col items-center bg-gray-300 font-mono">
      <div className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex size-full items-center justify-center bg-gray-200 dark:bg-black">
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div className="z-10 flex size-full flex-col items-center justify-center bg-orange-500">
          MAIN FULL WIDTH
          {/* TITLE AND SUBTITLE */}
          CONTENT FULL WIDTH
          <div className="flex w-full grow flex-col items-center justify-center bg-red-500/50 text-center">
            CONTENT FULL WIDTH
            <div className="flex size-full flex-col items-center justify-center bg-red-800/50">
              <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center bg-black/10 pt-6">
                <div className="text-6xl font-semibold text-slate-700">WEATHERFLAME</div>
                <div className="text-center text-sm font-light">
                  where the forecasts are hot, and mostly accurate
                </div>
                <InputLocation className="flex flex-row space-x-3 pt-6" />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center bg-blue-500/50">
            {/* DISCLAIMER */}
            GRAY FULL WIDTH
            <div className="max-w-4xl">
              <Alert className="rounded-none border-x-2 border-hidden border-gray-700 bg-black/10 p-6 text-gray-800">
                <AlertTitle className="pb-3">DISCLAIMER</AlertTitle>
                <AlertDescription>
                  <div>
                    This is a project built by someone learning how to code. It&apos;s a
                    work in progress, and far from done or perfect, but it&apos;s a start
                    on what I hope is a career one day. Check the readMe for more info.
                  </div>
                  <br />
                  <div>
                    While Weatherflame strives to deliver fun and functionality, please
                    don&apos;t use it to plan your wedding, your apocalypse survival
                    strategy, or a picnic under the stars.
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-500/50">
            <div className="flex flex-col items-center justify-center">
              BOTTOM FULL WIDTH
              <div className="max-w-4xl">
                <Alert className="rounded-none border-hidden bg-black/10 p-6 text-gray-800">
                  <AlertTitle className="pb-3">DISCLAIMER</AlertTitle>
                  <AlertDescription>
                    <div>
                      This is a project built by someone learning how to code. It&apos;s a
                      work in progress, and far from done or perfect, but it&apos;s a
                      start on what I hope is a career one day. Check the readMe for more
                      info.
                    </div>
                    <br />
                    <div>
                      While Weatherflame strives to deliver fun and functionality, please
                      don&apos;t use it to plan your wedding, your apocalypse survival
                      strategy, or a picnic under the stars.
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-500/50">
            <div className="flex flex-col items-center justify-center">
              BOTTOM FULL WIDTH
              <div className="max-w-4xl">
                <Alert className="rounded-none border-hidden bg-black/10 p-6 text-gray-800">
                  <AlertTitle className="pb-3">DISCLAIMER</AlertTitle>
                  <AlertDescription>
                    <div>
                      This is a project built by someone learning how to code. It&apos;s a
                      work in progress, and far from done or perfect, but it&apos;s a
                      start on what I hope is a career one day. Check the readMe for more
                      info.
                    </div>
                    <br />
                    <div>
                      While Weatherflame strives to deliver fun and functionality, please
                      don&apos;t use it to plan your wedding, your apocalypse survival
                      strategy, or a picnic under the stars.
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      {/* <div className="broder flex h-full w-full flex-col items-center justify-around">
        <div className="flex grow flex-col items-center justify-center space-y-3 px-6">
          <div className="font-mono text-6xl font-semibold text-slate-700">
            WEATHERFLAME
          </div>
          <div className="text-center font-mono text-sm font-light">
            where the forecasts are hot, and mostly accurate
          </div>
          <InputLocation className="flex flex-row space-x-3 pt-6" />
        </div> */}
      {/* DISCLAIMER */}
      {/* <div className="px-6 pb-36">
          <Alert className="max-w-lg border-hidden bg-black/10 font-mono text-gray-800">
            <AlertTitle>DISCLAIMER</AlertTitle>
            <AlertDescription>
              <div>
                This is a project built by a curious new developer diving in headfirst to
                learn React, Next.js app router, Tailwindcss, tRPC, how to retreive data
                from public APIs and more.
              </div>
              <br />
              <div>
                While Weatherflame strives to deliver fun and functionality, please don’t
                use it to plan your wedding, your apocalypse survival strategy, or a
                picnic under the stars.
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div> */}
      {/* Footer */}
      <Footer />
    </main>
  );
}

// OLD CODE FOR REFEERENCE
//
// export default async function Home() {
//   return (
//     <main className="flex size-full grow flex-col items-center justify-around bg-[#FFB200] text-gray-600">
//       {/* <Header /> */}
//       {/* Content */}
//       <div className="flex w-full flex-col items-center">
//         <div className="my-12 flex grow flex-col items-center justify-center">
//           <h1 className="text-4xl md:text-6xl">weatherflame</h1>
//           <div className="mt-3">
//             <h5 className="text-center font-mono font-light italic md:text-lg">
//               &quot;where the forecasts are hot...
//             </h5>
//             <h5 className="text-center font-mono font-light italic md:text-lg">
//               and maybe accurate&quot;
//             </h5>
//           </div>
//           <div className="mt-10">
//             <InputLocation className="flex flex-row space-x-3" />
//           </div>
//         </div>
//         <div className="item m-6 max-w-sm rounded-md bg-black/10 p-6 md:max-w-xl">
//           <h5 className="text-lg md:text-xl">Disclaimer:</h5>
//           <p className="mt-2 text-xs md:text-sm">
//             This is a passion project built by a curious new developer diving headfirst
//             into React, Next.js, Tailwind, public APIs and more. While Weatherflame
//             strives to deliver fun and functionality, please don’t use it to plan your
//             wedding, your apocalypse survival strategy, or a picnic under the stars.
//           </p>
//           <p className="md:text:sm mt-2 text-xs font-semibold">
//             Accuracy is a bonus, not a guarantee. Proceed with humor and low expectations.
//           </p>
//         </div>
//       </div>
//       {/* <Footer /> */}
//     </main>
//   );
// }
