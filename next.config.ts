import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 24 saat cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'exeluofkwsgiemrdnllo.supabase.co',
        pathname:'/storage/v1/object/public/**'
      },
    ],
  },
};

export default withNextIntl(nextConfig);
