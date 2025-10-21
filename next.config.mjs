import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.microcms-assets.io'],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const configWithPWA = pwaConfig(nextConfig);

export default configWithPWA;
