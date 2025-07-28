import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard', // Change this to your desired default route
        permanent: true, // HTTP 308 permanent redirect
      }
    ]
  },
  // Keep other existing configs here
};

export default nextConfig;