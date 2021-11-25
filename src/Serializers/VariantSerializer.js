const RLP = require('rlp')
const FateTag = require('../FateTag')
const FateTuple = require('../types/FateTuple')
const FateVariant = require('../types/FateVariant')
const BaseSerializer = require('./BaseSerializer')

class VariantSerializer extends BaseSerializer {
    serialize(variant) {
        const valueTuple = new FateTuple(variant.valueTypes, variant.value)

        return [
            FateTag.VARIANT,
            ...RLP.encode(new Uint8Array(variant.arities)),
            variant.tag,
            ...this.globalSerializer.serialize(valueTuple)
        ]
    }

    deserializeStream(stream, typeInfo) {
        const buffer = new Uint8Array(stream)
        const decoded = RLP.decode(buffer.slice(1), true)
        const arities = [...decoded.data]
        const tag = decoded.remainder[0]
        const data = decoded.remainder.slice(1)
        let variants = []
        let valueType

        if (typeof typeInfo !== 'undefined') {
            variants = typeInfo.variants
            valueType = {
                ...typeInfo.variantType,
                valueTypes: Object.values(typeInfo.variants[tag])[0]
            }
        }

        const [els, rest] = this.globalSerializer.deserializeStream(data, valueType)

        return [
            new FateVariant(arities, tag, els.items, els.valueTypes, variants),
            rest
        ]
    }
}

module.exports = VariantSerializer
