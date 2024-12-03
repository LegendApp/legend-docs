import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import tailwindcssNesting from 'tailwindcss/nesting';

const isPublish = process.argv[process.argv.length - 1] === '--publishlegend';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Legend State',
            customCss: ['./src/tailwind.css', './src/editor.css', './src/overrides.css'],
            favicon: '/favicon.ico',
            social: {
                github: 'https://github.com/LegendApp/legend-state',
            },
            editLink: {
                baseUrl: 'https://github.com/LegendApp/legend-docs/edit/main/packages/state/',
            },
            sidebar: [
                {
                    label: 'Intro',
                    autogenerate: { directory: 'intro' },
                },
                {
                    label: 'Usage',
                    autogenerate: { directory: 'usage' },
                },
                {
                    label: 'React',
                    autogenerate: { directory: 'react' },
                },
                {
                    label: 'Persist and Sync',
                    autogenerate: { directory: 'sync' },
                },
                {
                    label: 'Guides',
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'Other',
                    autogenerate: { directory: 'other' },
                },
            ],
            components: {
                ThemeProvider: './src/Components/Overrides/ThemeProvider.astro',
                ...(isPublish
                    ? {
                          Header: './src/Components/Overrides/Header.astro',
                          MobileMenuFooter: './src/Components/Overrides/MobileMenuFooter.astro',
                      }
                    : {}),
            },
        }),
        react(),
        tailwind({ applyBaseStyles: false }),
    ],
    // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
    image: {
        service: passthroughImageService(),
    },
    vite: {
        css: {
            postcss: {
                plugins: [tailwindcssNesting()],
            },
        },
        ssr: { noExternal: ['usehooks-ts', 'react-icons'] },
    },
});
