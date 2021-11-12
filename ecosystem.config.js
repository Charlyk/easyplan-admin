module.exports = {
  apps: [{
    name: "easyplan-admin",
    script: 'yarn',
    args: 'start',
    exec_mode: 'cluster',
    interpreter: '/bin/bash',
  }]
}
