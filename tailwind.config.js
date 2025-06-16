import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 0 15px rgba(0, 0, 0, 0.18)', // this is the custom shadow of the circle of signin & signup pages.
      },
      width: {
        'circle_style': '700px', // this is the widh of the circle of signin & signup pages.
      },
      screens: {
        'xs_custom': '480px', // my breakpoint for screens bigger than 640px of the circle of signin & signup pages.
      },
      spacing: {
        '-450': '-450px', //  this is the top space of the circle of signin & signup pages.
      },
      zIndex: {
        '-1': '-1',
      },
      borderRadius: {
        '4xl': '10px', // Custom border-radius value
        '4xl-': '5px', // Custom border-radius value
      },
      colors: {
        joinly_blue: {
          light: "#AEB8FE",
          principale: "#758BFD",
          contraste: "#27187E",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
  ],
});