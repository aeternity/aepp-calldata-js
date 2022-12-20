const FateTuple = require('./FateTuple')
const FateByteArray = require('./FateByteArray')
const {symbolIdentifier} = require('../utils/hash')

class FateCalldata extends FateTuple {
    constructor(funName, argTypes, argsData) {
        const functionId = symbolIdentifier(funName)
        const funcBytes = new FateByteArray(functionId)
        const argsTuple = new FateTuple(argTypes, argsData)

        super(
            [funcBytes.type, argsTuple.type],
            [funcBytes, argsTuple]
        )
    }
}

module.exports = FateCalldata
