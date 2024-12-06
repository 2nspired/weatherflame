// TODO: Add a guard that only allows me to access this page with a password.

import InputLocation from '~/app/main/_components/InputLocation';

export default async function Experiments() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-700 font-mono text-white">
      <h2 className="py-3 text-lg">Experiments</h2>
      <div className="flex flex-col items-center justify-center">
        <div className="items- flex flex-row">
          <h1 className="px-6 pb-4 pt-6 text-5xl md:text-6xl ">weatherflame</h1>
        </div>
        <InputLocation />
      </div>
      <p className="mt-12 pl-3">you really shouldn&apos;t be in here...</p>
    </main>
  );
}
