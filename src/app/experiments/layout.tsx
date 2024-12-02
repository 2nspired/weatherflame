import Script from "next/script";

// import { isDev, isProd } from '~/utils/platform';

// import Banner from './_components/Banner';
// import DevWindowBreakpoint from "./_components/DevWindowBreakpoint";

// import MaintenanceMode from "./_components/MaintenanceMode";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const MAINTENANCE_MODE = false;

export default async function ExperimentsLayout({ children }: LayoutProps) {
  //   if (MAINTENANCE_MODE && isProd) {
  //     return <MaintenanceMode />;
  //   }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-slate-300 font-mono">
        <main className="flex flex-grow flex-col">{children}</main>
      </div>
    </>
  );
}
