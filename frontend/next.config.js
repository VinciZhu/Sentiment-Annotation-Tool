/** @type {import('next').NextConfig} */

const FASTAPI_URL = `http://${process.env.FASTAPI_HOST}:${process.env.FASTAPI_PORT}`
const NEXTJS_URL = `http://${process.env.NEXTJS_HOST}:${process.env.NEXTJS_PORT}`

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    API_URL: NEXTJS_URL + '/api',
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: FASTAPI_URL + '/:path*',
      },
    ]
  },
}

module.exports = nextConfig
