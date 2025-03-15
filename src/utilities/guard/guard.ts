import { type NextRequest } from 'next/server';

import { env } from '~/env';

export function routeGuard(request: NextRequest) {
  if (env.NODE_ENV !== 'production') {
    return;
  }
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return { error: 'unauthorized', status: 401 };
  }
}
