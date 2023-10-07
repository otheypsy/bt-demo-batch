import { gateway } from '../utils/bt.utils.js'

const createCustomer = async (params) => {
    try {
        const response = await gateway.customer.create(params)
        // console.log(response?.customer?.id || response)
        return response?.customer?.id || false
    } catch (e) {
        console.error('createCustomer', 'Braintree SDK request failed', e)
        return false
    }
}

const createPaymentMethod = async (params) => {
    try {
        const response = await gateway.paymentMethod.create(params)
        // console.log(response?.paymentMethod?.token || response)
        return response?.paymentMethod?.token || false
    } catch (e) {
        console.error('createPaymentMethod', 'Braintree SDK request failed', e)
        return false
    }
}

const searchCustomers = async (daysBack = 2) => {
    const data = []
    return new Promise((resolve) => {
        const today = new Date()
        const threshold = new Date()
        threshold.setDate(today.getDate() - daysBack)

        const searchStream = gateway.customer.search((search) => {
            search.createdAt().min(threshold)
        })

        searchStream.on('data', (customer) => {
            data.push(customer)
        })

        searchStream.on('end', () => {
            resolve(data)
        })
    })
}

export { createCustomer, createPaymentMethod, searchCustomers }
