/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app', 'components', 'lib', 'scripts'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
