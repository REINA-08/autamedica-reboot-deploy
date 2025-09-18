/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@autamedica/types', '@autamedica/shared', '@autamedica/auth', '@autamedica/hooks'],
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;