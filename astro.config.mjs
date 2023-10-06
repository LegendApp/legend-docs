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
      customCss: ["./src/tailwind.css"],
      social: {
        github: "https://github.com/LegendApp/legend-state",
      },
      sidebar: [
        {
          label: "Introduction",
          autogenerate: { directory: "1-introduction" },
        },
        {
          label: "Usage",
          autogenerate: { directory: "2-usage" },
        },
        {
          label: "React",
          autogenerate: { directory: "3-react" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "4-guides" },
        },
        {
          label: "Other",
          autogenerate: { directory: "5-other" },
        },
      ],
      components: isPublish ? {
        // Override the default `SocialLinks` component.
        Header: "./src/Components/Overrides/Header.astro",
      } : undefined,
    }),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: passthroughImageService(),
  },
});
