import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://blog.worksbyaaron.com',
  output: 'static',
  integrations: [tailwind({
    applyBaseStyles: true,
  })],
});
