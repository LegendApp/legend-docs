import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const isPublish = process.argv[process.argv.length - 1] === '--publishlegend';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Legend List',
            customCss: ['./src/tailwind.css', './src/editor.css', './src/overrides.css'],
            favicon: '/favicon.ico',
            social: {
                github: 'https://github.com/LegendApp/legend-list',
            },
            editLink: {
                baseUrl: 'https://github.com/LegendApp/legend-docs/edit/main/packages/list/',
            },
            sidebar: [
                {
                    label: 'Intro',
                    autogenerate: { directory: 'intro' },
                },
            ],
            components: {
                ThemeProvider: './src/Components/Overrides/ThemeProvider.astro',
                ...(isPublish
                    ? {
                          // Override the default `SocialLinks` component.
                          Header: './src/Components/Overrides/Header.astro',
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
    vite: { ssr: { noExternal: ['usehooks-ts', 'react-icons'] } },
});
