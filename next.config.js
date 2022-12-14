const withTM = require('next-transpile-modules')(['next-mui-helper', '@tawk.to/tawk-messenger-react']);

module.exports = withTM({
  webpack: (config) => config,
  env: {
    APP_ENV: process.env.APP_ENV,
    PUBNUB_ENV: process.env.PUBNUB_ENV,
    DEFAULT_CLINIC: process.env.DEFAULT_CLINIC,
    API_URL: process.env.API_URL,
    APP_URL: process.env.APP_URL,
    AUTH_APP_URL: process.env.AUTH_APP_URL,
    PUBNUB_PUBLISH_KEY: process.env.PUBNUB_PUBLISH_KEY,
    PUBNUB_SUBSCRIBE_KEY: process.env.PUBNUB_SUBSCRIBE_KEY,
  },
});
