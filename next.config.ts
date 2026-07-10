import type { NextConfig } from 'next';
import { ensureVariables } from '@/lib/env';
import { initialiseDatabase } from '@/lib/db';


(async () => {
  ensureVariables();
  await initialiseDatabase();
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
