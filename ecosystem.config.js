module.exports = {
  apps: [
    {
      name: 'easyplan-dev',
      mode: 'cluster',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
    },
  ],
};
