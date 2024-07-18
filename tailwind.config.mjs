/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: { 
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch', // add required value here
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
