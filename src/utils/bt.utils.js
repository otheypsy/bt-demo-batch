import braintree from 'braintree'
import { logger } from './logger.utils.js'

let gateway

const setupSDK = async () => {
    try {
        gateway = new braintree.BraintreeGateway({
            environment: braintree.Environment.Sandbox,
            merchantId: process.env.BT_MERCHANT_ID,
            publicKey: process.env.BT_PUBLIC_KEY,
            privateKey: process.env.BT_PRIVATE_KEY,
        })
    } catch (e) {
        logger.error('Failed to setup SDK instance', e)
    }
}

const getGateway = () => ({ ...gateway })

export { setupSDK, getGateway  }
