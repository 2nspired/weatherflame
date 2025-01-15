import DevWindowBreakpoint from '~/app/(main)/_components/DevWindowBreakpoint';
import MaintenanceMode from '~/app/(main)/_components/MaintenanceMode';
import { isDev, isProd } from '~/utilities/platform';

import Footer from './_components/Footer';

// import Header from './_components/Header';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const MAINTENANCE_MODE = false;

export default async function MainLayout({ children }: LayoutProps) {
  if (MAINTENANCE_MODE && isProd) {
    return <MaintenanceMode />;
  }
  console.log('ISDEV', isDev);
  console.log('ISPROD', isProd);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_NODE_ENV:', process.env.NEXT_PUBLIC_NODE_ENV);
  console.log('Is Development:', process.env.NEXT_PUBLIC_NODE_ENV === 'development');
  console.log('Is Production:', process.env.NEXT_PUBLIC_NODE_ENV === 'production');

  return (
    <>
      <div className="flex h-full min-h-full flex-col">
        {isDev && !isProd && <DevWindowBreakpoint />}
        {/* <Header /> */}
        {/* <Header /> */}
        <main className="flex grow flex-col items-center ">{children}</main>
        {/* <Footer /> */}
        <Footer />
      </div>
    </>
  );
}
