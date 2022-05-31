// module.exports = {
//   plugins: [
//     'postcss-flexbugs-fixes',
//     [
//       'postcss-preset-env',
//       {
//         autoprefixer: {
//           flexbox: 'no-2009',
//         },
//         stage: 3,
//         features: {
//           'custom-properties': false,
//         },
//       },
//     ],
//     'postcss-preset-env',
//     [
//       '@fullhuman/postcss-purgecss',
//       {
//         content: ['./pages/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
//         defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
//         skippedContentGlobs: ['node_modules/**', 'app/components/**'],
//         safelist: [
//           'html',
//           'body',
//           /^rdr/,
//           /^Toastify/,
//           /^rcp/,
//           '::after',
//           /^react-tel-input/,
//           /^country-list/,
//           /^form-control/,
//           /^flag/,
//           /^selected-flag/,
//           /^arrow/,
//           /^rhap/,
//           /^infinite-scroll/,
//           /^lb/,
//           'mobile-controls',
//           'rotater',
//           'rotatel',
//           'close',
//         ],
//       },
//     ],
//   ],
// };

module.exports = {
  plugins: [],
};
