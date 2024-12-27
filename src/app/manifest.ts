import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'weatherflame',
    short_name: 'WF',
    start_url: '/',
    display: 'browser',
    background_color: '#3F3E46',
    theme_color: '#3F3E46',
    icons: [
      {
        src: '/icons/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/icons/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}
