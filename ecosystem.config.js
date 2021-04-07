module.exports = {
  apps: [
    {
      name: 'easyplan-app',
      mode: 'cluster',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env_development: {
        APP_ENV: 'development',
      },
      env_production: {
        APP_ENV: 'production',
      },
    },
  ],
};
