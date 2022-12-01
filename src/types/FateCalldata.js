const FateTuple = require('./FateTuple')
const FateByteArray = require('./FateByteArray')
// const {FateTypeCalldata} = require('../FateTypes')
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

    // get valueTypes() {
    //     return this._valueTypes
    // }

    // get type() {
    //     return this._type
    // }

    // get size() {
    //     return this._items.length
    // }

    // get items() {
    //     return this._items
    // }

    // valueOf() {
    //     return this.prepareItems(e => e.valueOf())
    // }

    // prepareItems(callback) {
    //     const items = this._items.map(callback)

    //     if (this._type.name === 'record') {
    //         return zipObject(this._type.keys, items)
    //     }

    //     return items
    // }

    // accept(visitor) {
    //     return visitor.visitTuple(this)
    // }
}

module.exports = FateCalldata
