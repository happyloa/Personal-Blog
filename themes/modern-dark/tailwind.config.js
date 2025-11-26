const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, 'layout/**/*.ejs'),
    path.join(__dirname, 'source/**/*.js'),
    path.join(__dirname, 'source/**/*.css'),
    path.join(__dirname, '..', '..', 'source/**/*.md'),
    path.join(__dirname, '..', '..', 'source/**/*.yml')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        accent: '#0ea5e9'
      },
      boxShadow: {
        glow: '0 10px 40px rgba(14,165,233,0.25)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
