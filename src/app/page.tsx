import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="mt-24 rounded p-5 shadow-lg">
        <div className="py-2 text-lg">City</div>
        <div className="py-4 text-lg">State</div>
        <div className="py-2 text-sm">latitude and longitude</div>
        <div className="py-6 text-2xl">temperature</div>
        <div className="py-4 text-base">feels like</div>
        <div className="py-2 text-sm">wind speed</div>
        <div className="py-2 text-base">short description</div>
      </div>
    </main>
  );
}
