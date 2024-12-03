"use client";
// <-- hooks can only be used in client components

import { api } from "~/utilities/trpc/trpc-client";

export function ClientGreeting({ name }: { name: string }) {
  const greeting = api.test.hello.useQuery({ text: name });

  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
