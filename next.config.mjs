/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org'], // Add any other external domains here
  },
};

export default nextConfig;
