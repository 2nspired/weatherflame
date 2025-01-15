import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'preview', 'production'])
      .default('development'),
    // openweather map
    OPENWEATHER_API: z.string().min(1),
    // weatherstack
    WEATHERSTACK_API: z.string().min(1),
    // google maps
    GOOGLE_MAPS_API: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // node
    NEXT_PUBLIC_NODE_ENV: z
      .enum(['development', 'test', 'preview', 'production'])
      .default('development'),
    // vercel
    NEXT_PUBLIC_VERCEL_URL: z.string().min(1),
    // google maps
    NEXT_PUBLIC_GOOGLE_MAPS_API: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // server
    NODE_ENV: process.env.NODE_ENV,
    OPENWEATHER_API: process.env.OPENWEATHER_API,
    WEATHERSTACK_API: process.env.WEATHERSTACK_API,
    GOOGLE_MAPS_API: process.env.GOOGLE_MAPS_API,

    // client
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
