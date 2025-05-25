/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remover configurações problemáticas para deploy
  trailingSlash: true,
  // Configuração mais simples para áudios
  async rewrites() {
    return [
      {
        source: '/sounds/:path*',
        destination: '/sounds/:path*',
      },
    ]
  },
};

export default nextConfig;
