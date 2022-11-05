/** @type {import('next').NextConfig} */
const path = require('path');

const withTM = require('next-transpile-modules')([
  'react-syntax-highlighter',
  'swagger-client',
  'swagger-ui-react'
]);

const cfg = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  swcMinify: false
};

module.exports = withTM(cfg);
