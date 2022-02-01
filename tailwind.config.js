module.exports = {
  content: ['./src/{pages,components,modules}/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Lato', 'Arial', 'sans-serif']
    },
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {}
  },
  darkMode: 'media',
  plugins: [
    require('tailwind-css-variables')(
      {
        // modules
      },
      {
        // options
      }
    )
  ]
}
