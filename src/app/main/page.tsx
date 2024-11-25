// import Footer from "./_components/Footer";
// import Header from "./_components/Header";

import { getLocationByZip, getLocationByName } from "~/server/api/location";

export default async function Home() {
  console.log(
    "BY ZIP ------->>>>> RUN",
    await getLocationByZip({ zip: "90210", countryCode: "us" }),
  );

  console.log(
    "BYNAME ------->>>>>",
    await getLocationByName({
      city: "san antonio",
      stateCode: "tx",
      countryCode: "us",
    }),
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-700 font-mono text-white">
      {/* <Header /> */}
      Main Page
      {/* Content */}
      <div className="px-6 pb-4 pt-6 text-5xl md:text-6xl ">weatherflame</div>
      <div className="text-l rounded-lg border border-white px-3 py-1.5 md:text-xl">
        alerts
      </div>
      <div className="mt-12 pl-3">coming soon...</div>
      {/* <Footer /> */}
    </main>
  );
}
