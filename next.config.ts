import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Ignore React Native sample files
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/sample context/**', '**/node_modules']
    };
    return config;
  },
  // Exclude sample context from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
