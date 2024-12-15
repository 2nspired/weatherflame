// TODO: DEV MODE
// TODO: DEV WINDOW BREAKPOINT UTILITY
// TODO: MAINTENANCE MODE

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
      <div className="flex min-h-full flex-col font-mono">
        <main className="flex grow flex-col">{children}</main>
      </div>
    </>
  );
}
