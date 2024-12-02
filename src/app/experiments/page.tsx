// import Footer from "./_components/Footer";
// import Header from "./_components/Header";

import { trpc } from "~/server/trpc/trpc-server";
import { Suspense } from "react";
import { ClientGreeting } from "~/app/experiments/_components/client-greeting";

export default async function Experiments() {
  void trpc.hello.prefetch({ text: "Thomas" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-700 font-mono text-white">
      {/* <Header /> */}
      EXPERIMENTS
      {/* Content */}
      <div>...</div>
      {/** ... */}
      <Suspense fallback={<div>Loading...</div>}>
        <ClientGreeting name="Thomas" />
      </Suspense>
      {/* <Footer /> */}
    </main>
  );
}
