const test = require('../test')
const TypeSerializer = require('../../src/Serializers/TypeSerializer')
const FateTag = require('../../src/FateTag')
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
} = require('../../src/FateTypes')

const s = new TypeSerializer()

test('Deserialize basic types', t => {
    t.plan(5)
    t.deepEqual(s.deserialize([FateTag.TYPE_INTEGER]), FateTypeInt())
    t.deepEqual(s.deserialize([FateTag.TYPE_BOOLEAN]), FateTypeBool())
    t.deepEqual(s.deserialize([FateTag.TYPE_BITS]), FateTypeBits())
    t.deepEqual(s.deserialize([FateTag.TYPE_STRING]), FateTypeString())
    t.deepEqual(s.deserialize([FateTag.TYPE_ANY]), FateTypeAny())
})

test('Deserialize object types', t => {
    t.plan(5)
    t.deepEqual(
        s.deserialize([FateTag.TYPE_OBJECT, FateTag.OTYPE_ADDRESS]),
        FateTypeAccountAddress()
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_OBJECT, FateTag.OTYPE_CONTRACT]),
        FateTypeContractAddress()
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_OBJECT, FateTag.OTYPE_ORACLE]),
        FateTypeOracleAddress()
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_OBJECT, FateTag.OTYPE_ORACLE_QUERY]),
        FateTypeOracleQueryAddress()
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_OBJECT, FateTag.OTYPE_CHANNEL]),
        FateTypeChannelAddress()
    )
})

test('Deserialize composite types', t => {
    t.plan(6)
    t.deepEqual(s.deserialize([FateTag.TYPE_VAR, 123]), FateTypeVar(123))
    t.deepEqual(s.deserialize([FateTag.TYPE_BYTES, 111, 130, 1, 192]), FateTypeBytes(512n))
    t.deepEqual(
        s.deserialize([FateTag.TYPE_LIST, FateTag.TYPE_INTEGER]),
        FateTypeList(FateTypeInt())
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_MAP, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER]),
        FateTypeMap(FateTypeString(), FateTypeInt())
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_TUPLE, 2, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER]),
        FateTypeTuple([FateTypeString(), FateTypeInt()])
    )
    t.deepEqual(
        s.deserialize([FateTag.TYPE_VARIANT, 2, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER]),
        FateTypeVariant([FateTypeString(), FateTypeInt()])
    )
})
