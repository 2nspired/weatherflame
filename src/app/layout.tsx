import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { TRPCReactProvider } from '~/trpc/client';

import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Flame',
  description: 'Compare weather information by location',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="size-full">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} size-full font-sans antialiased`}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
