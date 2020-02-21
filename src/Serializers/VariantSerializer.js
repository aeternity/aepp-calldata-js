const RLP = require('rlp')
const FateTag = require('../FateTag.js')
const FateTuple = require('../types/FateTuple.js')

VariantSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

VariantSerializer.prototype = {
    serialize: function (variant) {
        const valueTuple = new FateTuple(variant.valueTypes, variant.value)

        return  [
            FateTag.VARIANT,
            ...RLP.encode(new Uint8Array(variant.arities)),
            variant.tag,
            ...this.globalSerializer.serialize(valueTuple)
        ]
    }
}

module.exports = VariantSerializer
