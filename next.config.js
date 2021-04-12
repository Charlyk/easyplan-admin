const withTM = require('next-transpile-modules')(['next-mui-helper'])

module.exports = withTM({
  env: {
    APP_ENV: 'local'
  }
});
