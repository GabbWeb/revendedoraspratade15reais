/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pratade15reais.com.br', 'your-supabase-project.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig