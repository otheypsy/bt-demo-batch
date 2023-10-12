import { logger } from '../utils/logger.utils.js'
import { getGateway } from '../utils/bt.utils.js'

const createTransaction = async (params) => {
    const gateway = getGateway()
    try {
        const response = await gateway.transaction.sale(params)
        // console.log(response?.transaction?.id || response)
        return response?.transaction?.id || false
    } catch (e) {
        logger.error('createTransaction', 'Braintree SDK request failed', e)
        return false
    }
}

const searchTransactionsByStatuses = async (statuses = ['authorized'], daysBack = 2) => {
    const gateway = getGateway()
    const data = []
    return new Promise((resolve) => {
        const today = new Date()
        const threshold = new Date()
        threshold.setDate(today.getDate() - daysBack)

        const searchStream = gateway.transaction.search((search) => {
            search.status().in(statuses)
            search.createdAt().min(threshold)
        })

        searchStream.on('data', (transaction) => {
            data.push({ id: transaction.id, status: transaction.status })
        })

        searchStream.on('end', () => {
            resolve(data)
        })
    })
}

const voidTransaction = async (transactionId) => {
    const gateway = getGateway()
    try {
        const response = await gateway.transaction.void(transactionId)
        // console.log(response?.transaction?.id || response)
        return response?.transaction?.id || false
    } catch (e) {
        logger.error('voidTransaction', 'Braintree SDK request failed', e)
        return false
    }
}

const settleTransaction = async (transactionId) => {
    const gateway = getGateway()
    try {
        const response = await gateway.transaction.submitForSettlement(transactionId)
        // console.log(response?.transaction?.id || response)
        return response?.transaction?.id || false
    } catch (e) {
        logger.error('settleTransaction', 'Braintree SDK request failed', e)
        return false
    }
}

const refundTransaction = async (transactionId) => {
    const gateway = getGateway()
    try {
        const response = await gateway.transaction.refund(transactionId)
        // console.log(response?.transaction?.id || response)
        return response?.transaction?.id || false
    } catch (e) {
        console.error('refundTransaction', 'Braintree SDK request failed', e)
        return false
    }
}

export { createTransaction, searchTransactionsByStatuses, voidTransaction, settleTransaction, refundTransaction }
