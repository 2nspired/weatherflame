import { type NextRequest } from 'next/server';

import { env } from '~/env';

export function routeGuard(request: NextRequest) {
  if (env.NODE_ENV !== 'production') {
    return;
  }
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('unauthorized', { status: 401 });
  }
}
