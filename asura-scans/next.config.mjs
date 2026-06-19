/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  eslint: {
    // Lint is run as a separate CI step; do not fail production builds on lint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
