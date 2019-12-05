const { Universal: Ae } = require('@aeternity/aepp-sdk')
const fs = require('fs')

const bytecode = fs.readFileSync('build/identity.aeb', 'utf-8')
const calldata = 'cb_KxFE1kQfP4oEp9E='
const url = 'https://testnet.aeternity.io'
const keypair = {
    secretKey: '4ddf32462f7ffc05171680eaf11c4ec54ce36b2346af77a6e6d586e52d1bd51222f9f68c73cbc9617a117c750e0ef286f88f56ab81a5aa4d769e7c6eccf479e3',
    publicKey: 'ak_GQRgviNXFkcdyb9VvTdtuS9WsGdGoVmetaKroD8d7NJUPp3Qa',
}

Ae({ url, keypair }).then(ae => {
    ae.contractDeploy(bytecode, "", calldata).then(contract => {
        console.log(contract)
    })
})
