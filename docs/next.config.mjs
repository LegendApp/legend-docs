import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@legendapp/motion'],
  webpack: (config, { isServer }) => {
    // React Native Web setup
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Completely replace react-native with react-native-web
      'react-native': 'react-native-web',
    };

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    // Exclude react-native from being processed by Next.js
    config.module.rules.push({
      test: /node_modules\/react-native\//,
      use: 'ignore-loader',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default withMDX(config);
