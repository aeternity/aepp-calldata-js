const FateTag = require('../FateTag')
const BaseSerializer = require('./BaseSerializer')
const IntSerializer = require('./IntSerializer')
const FatePrefixError = require('../Errors/FatePrefixError')
const {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeChannelAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
    FateTypeVar,
    FateTypeAny,
} = require('../FateTypes')

const BASIC_TYPES = {
    [FateTag.TYPE_INTEGER]: FateTypeInt(),
    [FateTag.TYPE_BOOLEAN]: FateTypeBool(),
    [FateTag.TYPE_BITS]: FateTypeBits(),
    [FateTag.TYPE_STRING]: FateTypeString(),
    [FateTag.TYPE_ANY]: FateTypeAny(),
}

const OBJECT_TYPES = {
    [FateTag.OTYPE_ADDRESS]: FateTypeAccountAddress(),
    [FateTag.OTYPE_CONTRACT]: FateTypeContractAddress(),
    [FateTag.OTYPE_ORACLE]: FateTypeOracleAddress(),
    [FateTag.OTYPE_ORACLE_QUERY]: FateTypeOracleQueryAddress(),
    [FateTag.OTYPE_CHANNEL]: FateTypeChannelAddress(),
}

class TypeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super(globalSerializer)

        this._intSerializer = new IntSerializer()
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]

        if (BASIC_TYPES.hasOwnProperty(prefix)) {
            return [BASIC_TYPES[prefix], buffer.slice(1)]
        }

        if (prefix === FateTag.TYPE_OBJECT) {
            const obj = buffer[1]

            if (!OBJECT_TYPES.hasOwnProperty(obj)) {
                throw new FatePrefixError(obj, 'Unsupported object type')
            }

            return [OBJECT_TYPES[obj], buffer.slice(2)]
        }

        if (prefix === FateTag.TYPE_VAR) {
            return [FateTypeVar(buffer[1]), buffer.slice(2)]
        }

        if (prefix === FateTag.TYPE_BYTES) {
            const [size, rest] = this._intSerializer.deserializeStream(buffer.slice(1))

            return [FateTypeBytes(size.valueOf()), rest]
        }

        if (prefix === FateTag.TYPE_LIST) {
            const [elementsType, rest] = this.deserializeStream(buffer.slice(1))

            return [FateTypeList(elementsType), rest]
        }

        if (prefix === FateTag.TYPE_MAP) {
            const [keyType, rest] = this.deserializeStream(buffer.slice(1))
            const [valueType, rest2] = this.deserializeStream(rest)

            return [FateTypeMap(keyType, valueType), rest2]
        }

        if (prefix === FateTag.TYPE_TUPLE) {
            const size = buffer[1]
            const elementTypes = []
            let rest = buffer.slice(2)
            let el

            for (let i = 0; i < size; i++) {
                [el, rest] = this.deserializeStream(rest)
                elementTypes.push(el)
            }

            return [FateTypeTuple(elementTypes), rest]
        }

        if (prefix === FateTag.TYPE_VARIANT) {
            const size = buffer[1]
            const variants = []
            let rest = buffer.slice(2)
            let el

            for (let i = 0; i < size; i++) {
                [el, rest] = this.deserializeStream(rest)
                variants.push(el)
            }

            return [FateTypeVariant(variants), rest]
        }

        throw new FatePrefixError(prefix)
    }
}

module.exports = TypeSerializer
