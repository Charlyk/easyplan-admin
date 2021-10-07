module.exports = {
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ],
    'postcss-preset-env',
    [
      '@fullhuman/postcss-purgecss',
      {
        content: [
          './pages/**/*.{js,jsx,ts,tsx}',
          './app/**/*.{js,jsx,ts,tsx}',
          './node_modules/react-date-range/dist/**/*.{js,jsx,ts,tsx}',
          './node_modules/react-color-palette/**/*.{js,jsx,ts,tsx}',
          './node_modules/react-toastify/**/*.{js,jsx,ts,tsx}',
          './node_modules/react-phone-input-2/**/*.{js,jsx,ts,tsx}',
          './node_modules/bootstrap/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: ["html", "body"],
      }
    ],
  ]
}
