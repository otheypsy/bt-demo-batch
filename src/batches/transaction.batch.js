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

const transactionBatch = async () => {
    await refundTransactions()
    await voidAuthTransactions()
    await settleAuthTransactions()

    for (const maid of usMAIDS) {
        // Sale
        await createSettledTransactions(cardNonces, maid, usAddresses)
        await createSettledTransactions(apmNonces, maid, usAddresses)

        // Auth
        await createAuthTransactions(cardNonces, maid, usAddresses)
        await createAuthTransactions(apmNonces, maid, usAddresses)
    }
    for (const maid of euMAIDS) {
        // Sale
        await createSettledTransactions(cardNonces, maid, euAddresses)
        await createSettledTransactions(apmNonces, maid, euAddresses)

        // Auth
        await createAuthTransactions(cardNonces, maid, euAddresses)
        await createAuthTransactions(apmNonces, maid, euAddresses)
    }
}

const createSettledTransactions = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    for (const nonce of nonces) {
        const params = {
            amount: getRandomNumber(100, 1000, 2),
            orderId: 'sale-' + crypto.randomUUID(),
            merchantAccountId: maid,
            paymentMethodNonce: nonce,
            customer: getRandomItems(customers, 1),
            billing: getRandomItems(addresses, 1),
            shipping: getRandomItems(addresses, 1),
            options: {
                submitForSettlement: true,
            },
        }
        await createTransaction(params)
    }
}

const createAuthTransactions = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    for (const nonce of nonces) {
        const params = {
            amount: getRandomNumber(100, 1000, 2),
            orderId: 'auth-' + crypto.randomUUID(),
            merchantAccountId: maid,
            paymentMethodNonce: nonce,
            customer: getRandomItems(customers, 1),
            billing: getRandomItems(addresses, 1),
            shipping: getRandomItems(addresses, 1),
            options: {
                submitForSettlement: false,
            },
        }
        await createTransaction(params)
    }
}

const voidAuthTransactions = async () => {
    const authTransactions = await searchTransactionsByStatuses(['authorized', 'submitted_for_settlement'])
    const voidTransactions = getRandomItems(authTransactions, authTransactions.length * 0.1)
    for (const transaction of voidTransactions) {
        await voidTransaction(transaction.id)
    }
}

const settleAuthTransactions = async () => {
    const authTransactions = await searchTransactionsByStatuses(['authorized'])
    for (const transaction of authTransactions) {
        await settleTransaction(transaction.id)
    }
}

const refundTransactions = async () => {
    const settledTransactions = await searchTransactionsByStatuses(['settled', 'settling'])
    const refundTransactions = getRandomItems(settledTransactions, settledTransactions.length * 0.2)
    for (const transaction of refundTransactions) {
        await refundTransaction(transaction.id)
    }
}

export { transactionBatch }
