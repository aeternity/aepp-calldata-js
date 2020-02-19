const FateTag = require('../FateTag.js')
const RLP = require('rlp')
const {FateTypeTuple} = require('../../src/FateTypes.js')

VariantSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

VariantSerializer.prototype = {
    serialize: function (data) {
        const [type, value] = data
        return  [
            FateTag.VARIANT,
            ...RLP.encode(new Uint8Array(type.arities)),
            value.tag,
            ...this.globalSerializer.serialize([type.variantType, value.variantValues])
        ]
    }
}

module.exports = VariantSerializer
