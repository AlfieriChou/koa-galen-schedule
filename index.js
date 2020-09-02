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
    console.log('After job instantiation')
    job.start()
  `, 'index.js')
}, Promise.resolve())
