import { logger } from '../utils/logger.utils.js'
import { usMAIDS, euMAIDS } from '../data/maid.data.js'
import { cardNonces, apmNonces } from '../data/nonce.data.js'
import { customers } from '../data/customer.data.js'
import { usAddresses, euAddresses } from '../data/address.data.js'
import { getRandomNumber, getRandomItems } from '../utils/core.utils.js'
import {
    createTransaction,
    searchTransactionsByStatuses,
    voidTransaction,
    settleTransaction,
    refundTransaction,
} from '../services/transaction.service.js'

const createSettledTransactions = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    let counter = 0
    for (const nonce of nonces) {
        const params = {
            amount: getRandomNumber(100, 1000, 2),
            orderId: `sale-${crypto.randomUUID()}`,
            merchantAccountId: maid,
            paymentMethodNonce: nonce,
            customer: getRandomItems(customers, 1),
            billing: getRandomItems(addresses, 1),
            shipping: getRandomItems(addresses, 1),
            options: {
                submitForSettlement: true,
            },
        }
        const response = await createTransaction(params)
        if(response !== false) counter += 1
    }
    return counter
}

const createAuthTransactions = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    let counter = 0
    for (const nonce of nonces) {
        const params = {
            amount: getRandomNumber(100, 1000, 2),
            orderId: `auth-${crypto.randomUUID()}`,
            merchantAccountId: maid,
            paymentMethodNonce: nonce,
            customer: getRandomItems(customers, 1),
            billing: getRandomItems(addresses, 1),
            shipping: getRandomItems(addresses, 1),
            options: {
                submitForSettlement: false,
            },
        }
        const response = await createTransaction(params)
        if(response !== false) counter += 1
    }
    return counter
}

const refundTransactions = async () => {
    const settledTransactions = await searchTransactionsByStatuses(['settled', 'settling'])
    const randomTransactions = getRandomItems(settledTransactions, settledTransactions.length * 0.2)
    let counter = 0
    for (const transaction of randomTransactions) {
        const response = await refundTransaction(transaction.id)
        if(response !== false) counter += 1
    }
    return counter
}

const voidAuthTransactions = async () => {
    const authTransactions = await searchTransactionsByStatuses(['authorized', 'submitted_for_settlement'])
    const randomTransactions = getRandomItems(authTransactions, authTransactions.length * 0.1)
    let counter = 0
    for (const transaction of randomTransactions) {
        const response = await voidTransaction(transaction.id)
        if(response !== false) counter += 1
    }
    return counter
}

const settleAuthTransactions = async () => {
    const authTransactions = await searchTransactionsByStatuses(['authorized'])
    let counter = 0
    for (const transaction of authTransactions) {
        const response = await settleTransaction(transaction.id)
        if(response !== false) counter += 1
    }
    return counter
}

const transactionBatch = async () => {

    let counter = await refundTransactions()
    logger.info(`${counter} transactions refunded`)
    counter = await voidAuthTransactions()
    logger.info(`${counter} transactions voided`)
    counter = await settleAuthTransactions()
    logger.info(`${counter} auth transactions settled`)

    for (const maid of usMAIDS) {
        // Sale
        counter = await createSettledTransactions(cardNonces, maid, usAddresses)
        logger.info(`${counter} settled card transactions created in ${maid}`)
        counter = await createSettledTransactions(apmNonces, maid, usAddresses)
        logger.info(`${counter} settled APM transactions created in ${maid}`)

        // Auth
        counter = await createAuthTransactions(cardNonces, maid, usAddresses)
        logger.info(`${counter} auth card transactions created in ${maid}`)
        counter = await createAuthTransactions(apmNonces, maid, usAddresses)
        logger.info(`${counter} auth APM transactions created in ${maid}`)
    }

    for (const maid of euMAIDS) {
        // Sale
        counter = await createSettledTransactions(cardNonces, maid, euAddresses)
        logger.info(`${counter} settled card transactions created in ${maid}`)
        counter = await createSettledTransactions(apmNonces, maid, euAddresses)
        logger.info(`${counter} settled APM transactions created in ${maid}`)

        // Auth
        counter = await createAuthTransactions(cardNonces, maid, euAddresses)
        logger.info(`${counter} auth card transactions created in ${maid}`)
        counter = await createAuthTransactions(apmNonces, maid, euAddresses)
        logger.info(`${counter} auth APM transactions created in ${maid}`)
    }

}

export { transactionBatch }
