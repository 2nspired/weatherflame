import { Suspense } from 'react';

import Alert from '~/app/experiments/alerts/_components/Alert';
import { api } from '~/trpc/server';

// --------------------------------------------------------------

export const dynamic = 'auto';
export default async function Alerts() {
  // RENDER

  return (
    <main className="flex min-h-screen w-full flex-col bg-cyan-500 p-4 md:p-10">
      <Suspense fallback={<div>Loading...</div>}>
        <Alert />
        {/* <Alert data={prefetchedData} /> */}
      </Suspense>
    </main>
  );
}

// Components
// --------------------------------------------------------------

// const LocalAlert = ({ alert }: { alert: AlertFeatureResponse[0] }) => {
//   const alertProps = alert.properties;
//   // console.log("ALERT PROPS ------>", alert);

//   return (
//     <main className="min-h-full max-w-full">
//       <div className="text-xs">
//         {alertProps &&
//           Object.keys(alertProps).map((prop) =>
//             AlertPropExclude.includes(prop) ? null : (
//               <div key={prop} className="items-center py-1">
//                 <div className="pr-1 text-sm font-extrabold">{`${prop}:`}</div>
//                 <div className="w-full grow-0 break-words">{`${alertProps[prop]}`}</div>
//               </div>
//             ),
//           )}
//       </div>
//     </main>
//   );
// };

// ORIGINAL CODE BELOW
//
// export default async function Alerts() {
//   // TODO: Will have to figure out how to call based on location. So need to find a way to pull location identifier from geo location.

//   const queryParams: AlertParams = {
//     status: ['actual'],
//     message_type: ['alert', 'update'],
//     event: [
//       'Winter Storm Warning',
//       'Winter Weather Advisory',
//       // 'Air Quality Alert',
//       // 'Extreme Fire Danger',
//       // 'Fire Warning',
//       // 'Fire Weather Watch',
//       // 'Extreme Fire Dange',
//       // 'Flood Watch',
//       // 'Flood Warning',
//       // code: ["FRW", "HWA", "HWW"],
//     ],
//     limit: 5,
//   };

//   const alertsData = await fetchWeatherAlerts(queryParams);

//   return (
//     <main className="flex min-h-screen w-full flex-col bg-cyan-500 p-4 md:p-10">
//       {/* Container */}
//       <div className="w-full max-w-4xl">
//         <h1 className="font-bold">ALERTS DYNAMIC ROUTE</h1>
//         {/* Component */}
//         {alertsData &&
//           alertsData.length > 0 &&
//           alertsData.map((alert) => (
//             <div key={alert.id} className="my-4 border border-black p-3">
//               <LocalAlert alert={alert} />
//             </div>
//           ))}
//       </div>
//     </main>
//   );
// }

// // Components
// // --------------------------------------------------------------

// const LocalAlert = ({ alert }: { alert: AlertFeatureResponse[0] }) => {
//   const alertProps = alert.properties;
//   // console.log("ALERT PROPS ------>", alert);

//   return (
//     <main className="min-h-full max-w-full">
//       <div className="text-xs">
//         {alertProps &&
//           Object.keys(alertProps).map((prop) =>
//             AlertPropExclude.includes(prop) ? null : (
//               <div key={prop} className="items-center py-1">
//                 <div className="pr-1 text-sm font-extrabold">{`${prop}:`}</div>
//                 <div className="w-full grow-0 break-words">{`${alertProps[prop]}`}</div>
//               </div>
//             ),
//           )}
//       </div>
//     </main>
//   );
// };
