/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    API_URL: `http://${process.env.NEXTJS_HOST}:${process.env.NEXTJS_PORT}/api`,
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${process.env.FASTAPI_HOST}:${process.env.FASTAPI_PORT}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
