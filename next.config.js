const withTM = require('next-transpile-modules')(['next-mui-helper']);

module.exports = withTM({
  webpack: (config) => config,
  env: {
    APP_ENV: process.env.APP_ENV,
    PUBNUB_ENV: process.env.PUBNUB_ENV,
    DEFAULT_CLINIC: process.env.DEFAULT_CLINIC,
    API_URL: process.env.API_URL,
    APP_URL: process.env.APP_URL,
  },
});
