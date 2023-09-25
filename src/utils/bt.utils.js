import braintree from 'braintree'

let gateway = undefined

const setupSDK = async () => {
    try {
        gateway = new braintree.BraintreeGateway({
            environment: braintree.Environment.Sandbox,
            merchantId: process.env.BT_MERCHANT_ID,
            publicKey: process.env.BT_PUBLIC_KEY,
            privateKey: process.env.BT_PRIVATE_KEY,
        })
    } catch (e) {
        console.error('Failed to setup SDK instance', e)
    }
}

export { setupSDK, gateway }
