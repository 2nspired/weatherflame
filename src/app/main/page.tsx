// import Footer from "./_components/Footer";
// import Header from "./_components/Header";

import InputLocation from '~/app/main/_components/InputLocation';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-yellow-700 font-mono text-white">
      {/* <Header /> */}
      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        <h2 className="py-3 text-xl">Main</h2>
        <div className="flex flex-col items-center justify-center">
          <div className="items- flex flex-row">
            <h1 className="px-6 pb-4 pt-6 text-5xl md:text-6xl ">weatherflame</h1>
          </div>
          <InputLocation />
        </div>
        <p className="mt-12 pl-3">coming soon...</p>
      </div>
      {/* <Footer /> */}
    </main>
  );
}

console.log('123456789101234567891012345678910');
