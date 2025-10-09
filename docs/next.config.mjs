import { createMDX } from 'fumadocs-mdx/next';

const svgModuleEntry = 'react-native-svg/lib/module/ReactNativeSVG.web.js';
const svgCjsEntry = 'react-native-svg/lib/commonjs/ReactNativeSVG.web.js';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    transpilePackages: ['@legendapp/motion', 'react-native-linear-gradient', 'react-native-svg'],
    turbopack: {
        resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs'],
        resolveAlias: {
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
            'react-native-svg$': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG.js': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG.native': svgModuleEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG': svgCjsEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG.js': svgCjsEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG.native': svgCjsEntry,
        },
    },
    webpack: (config, { isServer }) => {
        // React Native Web setup
        config.resolve.extensions = [
            '.web.ts',
            '.web.tsx',
            '.web.js',
            '.web.jsx',
            ...(config.resolve.extensions || []),
        ];

        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            // Completely replace react-native with react-native-web
            'react-native$': 'react-native-web',
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
            'react-native-svg$': svgModuleEntry,
            'react-native-svg': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG.js': svgModuleEntry,
            'react-native-svg/lib/module/ReactNativeSVG.native': svgModuleEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG': svgCjsEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG.js': svgCjsEntry,
            'react-native-svg/lib/commonjs/ReactNativeSVG.native': svgCjsEntry,
        };

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
