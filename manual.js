import * as dotenv from 'dotenv'
import { setupSDK } from './src/utils/bt.utils.js'
import { transactionBatch } from './src/batches/transaction.batch.js'
import { vaultBatch } from './src/batches/vault.batch.js'

const run = async () => {
    console.log('BATCH START :: ' + new Date().toDateString())
    dotenv.config()
    await setupSDK()
    await vaultBatch()
    await transactionBatch()
    console.log('BATCH END');
}

run().then()
