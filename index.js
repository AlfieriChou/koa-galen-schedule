const { NodeVM } = require('vm2')

const schedules = require('./schedule.json')

const vm = new NodeVM({
  require: {
    external: true
  }
})

schedules.reduce(async (promise, schedule) => {
  await promise
  vm.run(`
    const { CronJob } = require('cron')
    const job = new CronJob('${schedule.time}', ${schedule.task})
    job.start()
  `, `${schedule.name || 'index'}.js`)
}, Promise.resolve())
