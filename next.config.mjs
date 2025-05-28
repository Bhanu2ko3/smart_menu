/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https", // Allow HTTPS URLs
        hostname: "**", // Wildcard to allow all hostnames
      },
      {
        protocol: "http", // Optionally allow HTTP URLs (less secure, use with caution)
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;