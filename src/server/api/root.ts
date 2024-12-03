import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { locationRouter } from "./routers/_location";
import { alertRouter } from "./routers/_alert";
import { testRouter } from "./routers/_experiment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  location: locationRouter,
  alerts: alertRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type TRPCInputs = inferRouterInputs<AppRouter>;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
