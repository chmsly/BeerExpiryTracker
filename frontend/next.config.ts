import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // Proxy to Spring Boot backend
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3000/api', // This resolves to the backend via proxy
  },
};

export default nextConfig;
