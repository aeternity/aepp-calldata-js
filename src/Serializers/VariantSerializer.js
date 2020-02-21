const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateTuple = require('../types/FateTuple.js')

VariantSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

VariantSerializer.prototype = {
    serialize: function (data) {
        const [type, value] = data
        const valueTuple = new FateTuple(type.variantType.valueTypes, value.variantValues)

        return  [
            FateTag.VARIANT,
            ...RLP.encode(new Uint8Array(type.arities)),
            value.tag,
            ...this.globalSerializer.serialize(valueTuple)
        ]
    }
}

module.exports = VariantSerializer
