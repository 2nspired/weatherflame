"use client";
// <-- hooks can only be used in client components

import { trpc } from "~/server/trpc/trpc-client";

export function ClientGreeting({ name }: { name: string }) {
  const greeting = trpc.hello.useQuery({ text: name });

  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
