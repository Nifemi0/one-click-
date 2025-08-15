/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig