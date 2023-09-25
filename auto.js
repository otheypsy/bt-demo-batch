import * as dotenv from 'dotenv'
import { CronJob } from 'cron'
import { setupSDK } from './src/utils/bt.utils.js'
import { transactionBatch } from './src/batches/transaction.batch.js'
import { vaultBatch } from './src/batches/vault.batch.js'

const morningJob = new CronJob('00 00 08 * * *', async () => {
    const today = new Date()
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log('Morning Cron Job -- ' + time)
    await vaultBatch()
    await transactionBatch()
})

const run = async () => {
    dotenv.config()
    await setupSDK()
    // morningJob.start()
}

run().then()
