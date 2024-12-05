// import Footer from "./_components/Footer";
// import Header from "./_components/Header";
import Landing from '~/app/main/_components/Landing';

// import { api } from '~/trpc/server';

export default async function Experiments() {
  // const getGeoByZip = await api.location.getGeoByZip({ zip: '90210', countryCode: 'US' });
  // console.log('PAGE RETURN ------------->>>>>>>>>> getGeoByZip', getGeoByZip);

  // const getGeoByName = await api.location.getGeoByName({
  //   city: 'Franklin',
  //   stateCode: 'TN',
  //   countryCode: 'US',
  // });
  // console.log('PAGE RETURN ------------->>>>>>>>>> getGeoByNAMMMEEEEEEE', getGeoByName);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-700 font-mono text-white">
      {/* <Header /> */}
      Experiments
      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        <Landing />
      </div>
      <div className="mt-12 pl-3">coming soon...</div>
      {/* <Footer /> */}
    </main>
  );
}
