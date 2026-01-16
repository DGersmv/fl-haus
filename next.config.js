const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    domains: ['tile.openstreetmap.org'],
  },

  webpack: (config, { isServer }) => {
    // Настройка для pdfjs-dist
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.mjs',
      three: path.resolve(__dirname, 'node_modules/three'),
    };

    // Исключение pdfjs-dist из серверного бандла
    if (isServer) {
      config.externals = [...config.externals, 'pdfjs-dist'];
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/external/og/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
