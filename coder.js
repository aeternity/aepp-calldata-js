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
        // console.log(argAci)

        let serializedArgs = []
        for (let i = 0; i < argAci.length; i++) {
            const value = args[i]
            const type = argAci[i].type
            const serArg = serializer.serialize(type, value)
            serializedArgs.push(serArg)
            // console.log("Serialize arg:", i, value, type, serArg, 
            //     serArg.map(a => a.toString(2).padStart(8, '0')))

        }

        // console.log(serializedArgs)
        // if (serializedArgs.length === 0) {
        //     const argsTuple = (serializedArgs.length === 0) ? serializeTuple([]) : serializeTuple(serializedArgs)
        // }

        const functionId = this.symbolIdentifier(funName)
        // console.log("Function ID:", functionId, serializeByteArray(functionId))

        const argsTuple = serializer.serialize('tuple', serializedArgs)
        // console.log("args typle:", argsTuple)
        // console.log(Array.from(functionId).concat(argsTuple))

        const funcTuple = serializer.serialize('tuple', [
                serializer.serialize('byte_array', functionId),
                argsTuple
        ])

        // console.log("function tuple", funcTuple)

        return new Uint8Array(funcTuple.flat(Infinity))
        // const calldata = serializeTuple(funcTuple)

        // return calldata
    },

    symbolIdentifier: function (funName) {
        // First 4 bytes of 32 bytes blake hash
        hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))
        // console.log("Blake2b 32 bytes hash", hash)

        return hash.slice(0, 4)
    }
}
