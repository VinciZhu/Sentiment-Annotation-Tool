/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    FASTAPI_URL: `http://${process.env.FASTAPI_HOST}:${process.env.FASTAPI_PORT}`,
  },
}

module.exports = nextConfig
