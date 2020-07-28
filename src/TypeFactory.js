const {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeHash,
    FateTypeSignature,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
} = require('./FateTypes.js')
const FateTag = require('./FateTag.js')

class TypeFactory {
    createType(tag) {
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

        throw new Error("Unknown tag: 0b" + tag.toString(2))
    }
}

module.exports = TypeFactory
