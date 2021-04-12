module.exports = {
  apps: [
    {
      name: 'easyplan-prod',
      mode: 'cluster',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
    },
  ],
};
