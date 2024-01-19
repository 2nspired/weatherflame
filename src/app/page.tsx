import WeatherTile from "./components/WeatherTile";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-4">
      <div className="justify-center text-xl">Welcome to weather.flame!</div>
      <div className="text-base">
        Use weather.flame to compare weather from different locations.
      </div>
      <WeatherTile />
    </main>
  );
}

//CHILDREN IS ANTHING IN PAGE.TSX
