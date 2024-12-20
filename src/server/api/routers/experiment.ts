import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const experimentsRouter = createTRPCRouter({
  getZipTest: publicProcedure
    .input(
      z.object({
        zip: z.string().max(4, 'server: Zip code cannot be more than 4 characters'),
      }),
    )
    .mutation(async ({ input }) => {
      console.log('ZIP TEST RESPONSE ------------->', input);
      return input;
    }),
});
