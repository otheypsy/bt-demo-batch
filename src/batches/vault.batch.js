import { logger } from '../utils/logger.utils.js'
import { cardNonces, apmNonces } from '../data/nonce.data.js'
import { customers } from '../data/customer.data.js'
import { getRandomNumber, getRandomItems } from '../utils/core.utils.js'
import { createCustomer, createPaymentMethod, searchCustomers } from '../services/vault.service.js'
import { euMAIDS, usMAIDS } from '../data/maid.data.js'
import { usAddresses, euAddresses } from '../data/address.data.js'
import { createTransaction } from '../services/transaction.service.js'

const createCustomers = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    let counter = 0
    for (const nonce of nonces) {
        const customerParams = {
            ...getRandomItems(customers, 1),
        }
        const customerId = await createCustomer(customerParams)
        if (customerId) {
            const pmtParams = {
                customerId,
                paymentMethodNonce: nonce,
                billingAddress: getRandomItems(addresses, 1),
                options: {
                    verificationMerchantAccountId: maid,
                    verifyCard: true,
                },
            }
            const response = await createPaymentMethod(pmtParams)
            if(response !== false) counter++
        }
    }
    return counter
}

const chargePaymentMethodTokens = async (maid, addresses) => {
    const customers = await searchCustomers()
    const chargeCustomers = getRandomItems(customers, customers.length * 0.6)
    let counter = 0
    for (const customer of chargeCustomers) {
        for (const paymentMethod of customer.paymentMethods) {
            const params = {
                amount: getRandomNumber(100, 1000, 2),
                orderId: `vault-sale-${crypto.randomUUID()}`,
                merchantAccountId: maid,
                paymentMethodToken: paymentMethod.token,
                shipping: getRandomItems(addresses, 1),
                options: {
                    submitForSettlement: true,
                },
            }
            const response = await createTransaction(params)
            if(response !== false) counter++
        }
    }
    return counter
}

const createPaymentMethodTokens = async () => {
    const customers = await searchCustomers()
    let counter = 0
    for (const customer of customers) {
        const params = {
            customerId: customer.id,
            paymentMethodNonce: getRandomItems([...cardNonces, ...apmNonces]),
            billingAddress: getRandomItems(usAddresses, 1),
            options: {
                verifyCard: true,
            },
        }
        const response = await createPaymentMethod(params)
        if(response !== false) counter++
    }
    return counter
}

const vaultBatch = async () => {

    let counter = await chargePaymentMethodTokens()
    logger.info(`${counter} tokens charged`)
    counter = await createPaymentMethodTokens()
    logger.info(`${counter} tokens created`)

    for (const maid of usMAIDS) {
        counter = await createCustomers(cardNonces, maid, usAddresses)
        logger.info(`${counter} customers with cards created through ${maid}`)
        counter = await createCustomers(apmNonces, maid, usAddresses)
        logger.info(`${counter} customers with APMs created through ${maid}`)
    }

    for (const maid of euMAIDS) {
        counter = await createCustomers(cardNonces, maid, euAddresses)
        logger.info(`${counter} customers with cards created through ${maid}`)
        counter = await createCustomers(apmNonces, maid, euAddresses)
        logger.info(`${counter} customers with APMs created through ${maid}`)
    }

}

export default vaultBatch
export { vaultBatch }
