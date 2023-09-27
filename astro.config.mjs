import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'Legend State',
    customCss: ['./src/tailwind.css'],
    social: {
      github: 'https://github.com/LegendApp/legend-state'
    },
    sidebar: [{
      label: 'Introduction',
      autogenerate: { directory: '1-introduction' },
    }]
  }), react(), tailwind({applyBaseStyles: false})],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});