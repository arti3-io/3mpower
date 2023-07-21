import './src/env.mjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // config images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

// module.exports = nextConfig;
export default nextConfig;
