import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client-side admin app: avoid static prerender surprises on Vercel
  output: undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
