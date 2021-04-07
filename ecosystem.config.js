module.exports = {
  apps: [
    {
      name: 'easyplan-app',
      mode: 'cluster',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env_development: {
        PORT: 3001,
        APP_ENV: 'development',
      },
      env_production: {
        PORT: 3000,
        APP_ENV: 'production',
      },
    },
  ],
};
