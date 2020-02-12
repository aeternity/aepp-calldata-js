const FATE = require('../fate.js')
const RLP = require('rlp')

VariantSerializer = function (globalSerializer) {
    this.globalSerializer = globalSerializer
}

VariantSerializer.prototype = {
    serialize: function (data) {
        return  [
            FATE.VARIANT,
            ...RLP.encode(new Uint8Array(data.arities)),
            data.tag,
            ...this.globalSerializer.serialize(['tuple', data.variantValues])
        ]
    }
}

module.exports = VariantSerializer
