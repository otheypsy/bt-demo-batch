import { cardNonces, apmNonces } from '../data/nonce.data.js'
import { customers } from '../data/customer.data.js'
import { getRandomNumber, getRandomItems } from '../utils/core.utils.js'
import { createCustomer, createPaymentMethod, searchCustomers } from '../services/vault.service.js'
import { euMAIDS, usMAIDS } from '../data/maid.data.js'
import { usAddresses, euAddresses } from '../data/address.data.js'
import { createTransaction } from '../services/transaction.service.js'

const vaultBatch = async () => {
    await chargePaymentMethodTokens()
    await createPaymentMethodTokens()

    for (const maid of usMAIDS) {
        await createCustomers(cardNonces, maid, usAddresses)
        await createCustomers(apmNonces, maid, usAddresses)
    }
    for (const maid of euMAIDS) {
        await createCustomers(cardNonces, maid, euAddresses)
    }
}

const createCustomers = async (
    nonces = [],
    maid = process.env.BT_DEFAULT_MERCHANT_ACCOUNT_ID,
    addresses = usAddresses,
) => {
    for (const nonce of nonces) {
        const customerParams = {
            ...getRandomItems(customers, 1),
        }
        const customerId = await createCustomer(customerParams)
        if (customerId) {
            const pmtParams = {
                customerId: customerId,
                paymentMethodNonce: nonce,
                billingAddress: getRandomItems(addresses, 1),
                options: {
                    verificationMerchantAccountId: maid,
                    verifyCard: true,
                },
            }
            await createPaymentMethod(pmtParams)
        }
    }
}

const chargePaymentMethodTokens = async (maid, addresses) => {
    const customers = await searchCustomers()
    const chargeCustomers = getRandomItems(customers, customers.length * 0.8)
    for (const customer of chargeCustomers) {
        for (const paymentMethod of customer.paymentMethods) {
            const params = {
                amount: getRandomNumber(100, 1000, 2),
                orderId: 'vault-sale-' + crypto.randomUUID(),
                merchantAccountId: maid,
                paymentMethodToken: paymentMethod.token,
                shipping: getRandomItems(addresses, 1),
                options: {
                    submitForSettlement: true,
                },
            }
            await createTransaction(params)
        }
    }
}

const createPaymentMethodTokens = async () => {
    const customers = await searchCustomers()
    for (const customer of customers) {
        const params = {
            customerId: customer.id,
            paymentMethodNonce: getRandomItems([...cardNonces, ...apmNonces]),
            billingAddress: getRandomItems(usAddresses, 1),
            options: {
                verifyCard: true,
            },
        }
        await createPaymentMethod(params)
    }
}

export { vaultBatch }
