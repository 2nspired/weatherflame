// import { isDev, isProd } from '~/utils/platform';

// import Banner from './_components/Banner';
// import DevWindowBreakpoint from "./_components/DevWindowBreakpoint";

// import MaintenanceMode from "./_components/MaintenanceMode";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

// const MAINTENANCE_MODE = false;

export default async function MainLayout({ children }: LayoutProps) {
  //   if (MAINTENANCE_MODE && isProd) {
  //     return <MaintenanceMode />;
  //   }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-red-700 font-mono">
        <main className="flex grow flex-col">{children}</main>
      </div>
    </>
  );
}

//  ORIGINAL

// return (
//     <>
//       <div className="flex min-h-full flex-col">
//         {isDev && <DevWindowBreakpoint />}
//         <Banner />
//         <Header />
//         <main className="flex flex-grow flex-col items-center shadow-page">
//           {children}
//         </main>
//         <Footer />
//       </div>
//       <Toaster />
//       <Script
//         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7365990025454219"
//         strategy="afterInteractive"
//         crossOrigin="anonymous"
//       ></Script>
//     </>
//   );
// }
