/** @type {import('next').NextConfig} */
const path = require('path');

const withTM = require('next-transpile-modules')([
  'react-syntax-highlighter',
  'swagger-client',
  'swagger-ui-react'
]);

const cfg = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ];
  }
};

module.exports = withTM(cfg);
