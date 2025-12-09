import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
      {
        protocol: 'https',
        hostname: '**.twimg.com',
      },
    ],
  },
  // Turbopackの設定エラーを回避するために空のturbopack設定を追加する
  // (ただし、next.config.ts の型定義によってはエラーになる可能性があるため、
  //  まずは experimental.turbopack を試すか、単純に空オブジェクトを渡す)
  experimental: {
    // turbopack: {}, // Next.js 15ではデフォルト有効だが、明示的な設定が必要な場合がある
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// PWA設定を適用
export default pwaConfig(nextConfig);
