module.exports = {
  apps: [{
    name: "easyplan-admin",
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
  }]
}
