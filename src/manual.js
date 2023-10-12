import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv'
import { logger } from './utils/logger.utils.js'
import { setupSDK } from './utils/bt.utils.js'
import { transactionBatch } from './batches/transaction.batch.js'
import { vaultBatch } from './batches/vault.batch.js'

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const run = async () => {
    logger.info(`BATCH START :: ${new Date().toDateString()}`)
    dotenv.config({ path: `${dirname}/../.env` })
    await setupSDK()
    await vaultBatch()
    await transactionBatch()
    logger.info('BATCH END');
}

run().then()
