const fs = require('fs')
const blake = require('blakejs')
const base64check = require('base64check')
const Serializer = require('./Serializer.js')

const HASH_BYTES = 32
const serializer = Object.create(Serializer)

module.exports = {
    encode: function (contractAci, funcName, args) {
        return 'cb_' + base64check.encode(this.serialize(contractAci, funcName, args))
    },

    serialize: function (contractAci, funName, args) {
        const funcAci = contractAci.functions.find(e => e.name == funName)
        const argAci = (funcAci) ? funcAci.arguments : []

        let taggedArgs = []
        for (let i = 0; i < argAci.length; i++) {
            const value = args[i]
            const type = argAci[i].type
            taggedArgs.push([type, value])
        }

        const functionId = this.symbolIdentifier(funName)
        const calldata = ['tuple', [
                ['byte_array', functionId],
                ['tuple', taggedArgs]
        ]]

        const serialized = serializer.serialize(calldata)

        return new Uint8Array(serialized.flat(Infinity))
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

        return hash.slice(0, 4)
    }
}
