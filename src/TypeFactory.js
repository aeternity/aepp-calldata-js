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
    FateTypeVariant,
} = require('./FateTypes.js')
const FateTag = require('./FateTag.js')

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

            switch(obj) {
                case 0:
                    return FateTypeAccountAddress()
                case 1:
                    return FateTypeBytes()
                case 2:
                    return FateTypeContractAddress()
                case 3:
                    return FateTypeOracleAddress()
                case 4:
                    return FateTypeOracleQueryAddress()
                default:
                    throw new Error("Unsupported object type: " + obj)
            }
        }

        throw new Error("Unknown tag: 0b" + tag.toString(2))
    }
}

module.exports = TypeFactory
