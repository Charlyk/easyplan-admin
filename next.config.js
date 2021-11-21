// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['next-mui-helper']);

module.exports = withTM({
  env: {
    APP_ENV: process.env.APP_ENV,
    DEFAULT_CLINIC: process.env.DEFAULT_CLINIC,
  },
});
