const { NodeVM } = require('vm2')
const readDirFilenames = require('read-dir-filenames')
const path = require('path')

const vm = new NodeVM({
  require: {
    external: true
  }
})

const run = async (schedulePath) => {
  const schedules = readDirFilenames(schedulePath || path.resolve(__dirname, './schedules'))
  schedules.reduce(async (promise, schedulePath) => {
    await promise
    const { schedule, task } = require(schedulePath)
    vm.run(`
      const { CronJob } = require('cron')
      const job = new CronJob('${schedule.time}', ${task})
      job.start()
    `, `${schedulePath || 'schedule'}.js`)
  }, Promise.resolve())
}

run()
