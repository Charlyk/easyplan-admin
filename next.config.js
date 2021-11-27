const withTM = require('next-transpile-modules')(['next-mui-helper']);

module.exports = withTM({
  webpack: (config) => config,
  env: {
    APP_ENV: process.env.APP_ENV,
    DEFAULT_CLINIC: process.env.DEFAULT_CLINIC,
    API_URL: process.env.API_URL,
    PUBNUB_ENV: process.env.PUBNUB_ENV,
  },
});
