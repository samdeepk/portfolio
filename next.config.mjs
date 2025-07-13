/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable custom domains
  async rewrites() {
    return [
      // Handle custom domain routing
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
  
  // Handle multiple domains
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Image optimization for custom domains
  images: {
    domains: [
      'srd.fund',
      'corp.sanskrut.com', 
      'ent.sanskrut.com',
      'sandeepkoduri.com',
      'localhost'
    ],
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
