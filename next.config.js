// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'firebase/app',
    'firebase/auth',
    'firebase/messaging',
    'react-syntax-highlighter',
    'swagger-client',
    'swagger-ui-react'
  ],
  async rewrites() {
    return [
      {
        source: '/_opengraph',
        destination: '/api/opengraph'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/events/:key/:tab',
        destination: '/events/:key',
        permanent: true
      },
      {
        source: '/insights/:tab',
        destination: '/insights',
        permanent: true
      }
    ];
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);
