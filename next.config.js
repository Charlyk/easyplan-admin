const withTM = require('next-transpile-modules')(['next-mui-helper']);

module.exports = withTM({
  env: {
    APP_ENV: process.env.APP_ENV,
  },
});
