/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        TTCommons: [
          'TTCommonsBlack',
          'TTCommonsBold',
          'TTCommonsDemiBold',
          'TTCommonsMedium',
          'TTCommonsRegular',
          'TTCommonsExtraBold'
        ]
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
  ]
}
