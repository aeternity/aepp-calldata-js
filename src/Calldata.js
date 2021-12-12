const FateByteArray = require('./types/FateByteArray')
const FateTuple = require('./types/FateTuple')
const {symbolIdentifier} = require('./utils/hash')

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
