import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "placehold.co"],
  },
};

export default nextConfig;
