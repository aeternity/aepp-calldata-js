const assert = require('./utils/assert')
const FateTag = require('./FateTag')
const FatePrefixError = require('./Errors/FatePrefixError')
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
    FateTypeType,
} = require('./FateTypes')

const OBJECT_TYPES = {
    [FateTag.OTYPE_ADDRESS]: FateTypeAccountAddress(),
    [FateTag.OTYPE_BYTES]: FateTypeBytes(),
    [FateTag.OTYPE_CONTRACT]: FateTypeContractAddress(),
    [FateTag.OTYPE_ORACLE]: FateTypeOracleAddress(),
    [FateTag.OTYPE_ORACLE_QUERY]: FateTypeOracleQueryAddress(),
    [FateTag.OTYPE_CHANNEL]: FateTypeChannelAddress(),
}

class TypeFactory {
    createType(data) {
        const tag = data[0]

        if (tag === FateTag.TRUE || tag === FateTag.FALSE) {
            return FateTypeBool()
        }

        if ((tag & 0x01) === FateTag.SMALL_INT
            || tag === FateTag.POS_BIG_INT
            || tag === FateTag.NEG_BIG_INT
        ) {
            return FateTypeInt()
        }

        if ((tag & 0x03) === FateTag.SHORT_STRING
            || tag === FateTag.LONG_STRING
            || tag === FateTag.EMPTY_STRING
        ) {
            return FateTypeString()
        }

        if ((tag & 0x0F) === FateTag.SHORT_LIST || tag === FateTag.LONG_LIST) {
            return FateTypeList()
        }

        if ((tag & 0x0F) === FateTag.SHORT_TUPLE
            || tag === FateTag.LONG_TUPLE
            || tag === FateTag.EMPTY_TUPLE
        ) {
            return FateTypeTuple()
        }

        if (tag === FateTag.MAP || tag === FateTag.EMPTY_MAP) {
            return FateTypeMap()
        }

        if (tag === FateTag.POS_BITS || tag === FateTag.NEG_BITS) {
            return FateTypeBits()
        }

        if (tag === FateTag.VARIANT) {
            return FateTypeVariant()
        }

        if (tag === FateTag.OBJECT) {
            const obj = data[1]
            assert(OBJECT_TYPES.hasOwnProperty(obj), `Unsupported object type "${obj}"`)

            return OBJECT_TYPES[obj]
        }

        if (tag === FateTag.TYPE_INTEGER
            || tag === FateTag.TYPE_BOOLEAN
            || tag === FateTag.TYPE_LIST
            || tag === FateTag.TYPE_TUPLE
            || tag === FateTag.TYPE_OBJECT
            || tag === FateTag.TYPE_BITS
            || tag === FateTag.TYPE_MAP
            || tag === FateTag.TYPE_STRING
            || tag === FateTag.TYPE_VARIANT
            || tag === FateTag.TYPE_BYTES
            || tag === FateTag.TYPE_CONTRACT_BYTEARRAY
            || tag === FateTag.TYPE_VAR
            || tag === FateTag.TYPE_ANY
        ) {
            return FateTypeType()
        }

        throw new FatePrefixError(tag)
    }
}

module.exports = TypeFactory
