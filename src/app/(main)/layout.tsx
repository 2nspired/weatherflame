import Script from "next/script";

// import { isDev, isProd } from '~/utils/platform';

// import Banner from './_components/Banner';
// import DevWindowBreakpoint from "./_components/DevWindowBreakpoint";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
// import MaintenanceMode from "./_components/MaintenanceMode";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const MAINTENANCE_MODE = false;

export default async function MainLayout({ children }: LayoutProps) {
  //   if (MAINTENANCE_MODE && isProd) {
  //     return <MaintenanceMode />;
  //   }

  return (
    <>
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="shadow-page flex flex-grow flex-col items-center">
          {children}
        </main>
        <Footer />
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
