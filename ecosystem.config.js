module.exports = {
  apps: [
    {
      name: "easyplan-admin",
      script: 'yarn',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      interpreter: 'bash',
    }
  ]
}
