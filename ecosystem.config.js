module.exports = {
  apps: [
    {
      name: 'easyplan-app',
      mode: 'cluster',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
    },
  ],
};
