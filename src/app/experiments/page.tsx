// import Footer from "./_components/Footer";
// import Header from "./_components/Header";

import Landing from '~/app/main/_components/Landing';

export default async function Experiments() {
  // console.log(
  //   "BY ZIP ------->>>>> RUN",
  //   await getLocationByZip({ zip: "90210", countryCode: "us" }),
  // );

  // console.log(
  //   "BYNAME ------->>>>>",
  //   await getLocationByName({
  //     city: "san antonio",
  //     stateCode: "tx",
  //     countryCode: "us",
  //   }),
  // )
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-700 font-mono text-white">
      {/* <Header /> */}
      Main Page
      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        <Landing />
      </div>
      <div className="mt-12 pl-3">coming soon...</div>
      {/* <Footer /> */}
    </main>
  );
}
