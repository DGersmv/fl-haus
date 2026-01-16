const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // Оптимизации для ускорения сборки
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Отключаем генерацию source maps в production для ускорения
  productionBrowserSourceMaps: false,
  
  // Standalone output - быстрее и стабильнее
  output: 'standalone',
  
  // Отключаем оптимизацию изображений во время сборки (ускоряет сборку)
  images: {
    domains: ['tile.openstreetmap.org'],
    unoptimized: false,
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

  // Увеличиваем лимит размера тела запроса для загрузки файлов
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

module.exports = nextConfig;
