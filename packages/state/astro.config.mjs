import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const isPublish = process.argv[process.argv.length - 1] === "--publishlegend";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Legend State",
      customCss: [
        "./src/tailwind.css",
        "./src/editor.css",
        "./src/overrides.css",
      ],
      social: {
        github: "https://github.com/LegendApp/legend-state",
      },
      editLink: {
        baseUrl: "https://github.com/LegendApp/legend-docs/edit/main/",
      },
      sidebar: [
        {
          label: "Intro",
          autogenerate: { directory: "intro" },
        },
        {
          label: "Usage",
          autogenerate: { directory: "usage" },
        },
        {
          label: "React",
          autogenerate: { directory: "react" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Other",
          autogenerate: { directory: "other" },
        },
      ],
      components: isPublish
        ? {
            // Override the default `SocialLinks` component.
            Header: "./src/Components/Overrides/Header.astro",
          }
        : undefined,
    }),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: passthroughImageService(),
  },
  vite: { ssr: { noExternal: [ 'usehooks-ts', 'react-icons' ] } } ,
});
