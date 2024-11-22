import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} h-full font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
