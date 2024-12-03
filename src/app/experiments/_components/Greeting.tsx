import { Suspense } from "react";
import { ClientGreeting } from "~/app/experiments/_components/client-greeting";
import { api } from "~/utilities/trpc/trpc-client";

export default function Greeting() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientGreeting name="Thomas" />
      </Suspense>
    </div>
  );
}
