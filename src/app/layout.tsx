import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WeatherTile from "./components/WeatherTile";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Flame",
  description: "Compare weather information by location",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <WeatherTile />
        <Footer />
      </body>
    </html>
  );
}
