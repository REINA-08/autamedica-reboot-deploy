/** @type {import('next').NextConfig} */
const nextConfig = {
  // Para production build, disabled estricto linting por el momento
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript temporalmente
  },
  // Transpile packages del monorepo
  transpilePackages: [
    '@autamedica/types',
    '@autamedica/shared', 
    '@autamedica/auth',
    '@autamedica/hooks',
    '@autamedica/ui',
    '@autamedica/utils'
  ],
  // Configuración experimental para mejor performance
  experimental: {
    // Mejorar builds de monorepo
    externalDir: true,
  },
};

export default nextConfig;