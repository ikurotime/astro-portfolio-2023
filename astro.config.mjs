import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({ site:

  process.env.NODE_ENV === "development"
    ? "http://localhost:4321"
    : "https://davidhuertas.dev",
  integrations: [tailwind(), react()]
});