const blake = require('blakejs')
const FateByteArray = require('./types/FateByteArray')
const FateTuple = require('./types/FateTuple')

const HASH_BYTES = 32

const symbolIdentifier = (funName) => {
    // First 4 bytes of 32 bytes blake hash
    const hash = Array.from(blake.blake2b(funName, null, HASH_BYTES))

    return hash.slice(0, 4)
}

const Calldata = (funName, argTypes, argsData) => {
    const functionId = symbolIdentifier(funName)
    const funcBytes = new FateByteArray(functionId)
    const argsTuple = new FateTuple(argTypes, argsData)

    return new FateTuple(
        [funcBytes.type, argsTuple.type],
        [funcBytes, argsTuple]
    )
}

module.exports = Calldata
