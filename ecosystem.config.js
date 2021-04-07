module.exports = {
  apps: [
    {
      name: 'easyplan-app',
      script: 'yarn start',
      env_development: {
        APP_ENV: 'development',
      },
      env_production: {
        APP_ENV: 'production',
      },
    },
  ],
};
