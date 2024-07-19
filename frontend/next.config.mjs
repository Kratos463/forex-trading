/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  },
  basePath: '',

  // Additional Next.js configurations
  reactStrictMode: true,
};

export default nextConfig;
