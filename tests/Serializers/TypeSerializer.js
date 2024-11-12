import test from '../test.js'
import TypeSerializer from '../../src/Serializers/TypeSerializer.js'
import FateTag from '../../src/FateTag.js'
import {
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
} from '../../src/FateTypes.js'

const s = new TypeSerializer()

test('Serialize basic types', t => {
    t.plan(5)
    t.deepEqual(s.serialize(FateTypeInt()), new Uint8Array([FateTag.TYPE_INTEGER]))
    t.deepEqual(s.serialize(FateTypeBool()), new Uint8Array([FateTag.TYPE_BOOLEAN]))
    t.deepEqual(s.serialize(FateTypeBits()), new Uint8Array([FateTag.TYPE_BITS]))
    t.deepEqual(s.serialize(FateTypeString()), new Uint8Array([FateTag.TYPE_STRING]))
    t.deepEqual(s.serialize(FateTypeAny()), new Uint8Array([FateTag.TYPE_ANY]))
})

test('Deserialize basic types', t => {
    t.plan(5)
    t.deepEqual(s.deserialize([FateTag.TYPE_INTEGER]), FateTypeInt())
    t.deepEqual(s.deserialize([FateTag.TYPE_BOOLEAN]), FateTypeBool())
    t.deepEqual(s.deserialize([FateTag.TYPE_BITS]), FateTypeBits())
    t.deepEqual(s.deserialize([FateTag.TYPE_STRING]), FateTypeString())
    t.deepEqual(s.deserialize([FateTag.TYPE_ANY]), FateTypeAny())
})

test('Serialize object types', t => {
    t.plan(5)
    t.deepEqual(
        s.serialize(FateTypeAccountAddress()),
        new Uint8Array([FateTag.TYPE_OBJECT, FateTag.OTYPE_ADDRESS])
    )
    t.deepEqual(
        s.serialize(FateTypeContractAddress()),
        new Uint8Array([FateTag.TYPE_OBJECT, FateTag.OTYPE_CONTRACT])
    )
    t.deepEqual(
        s.serialize(FateTypeOracleAddress()),
        new Uint8Array([FateTag.TYPE_OBJECT, FateTag.OTYPE_ORACLE])
    )
    t.deepEqual(
        s.serialize(FateTypeOracleQueryAddress()),
        new Uint8Array([FateTag.TYPE_OBJECT, FateTag.OTYPE_ORACLE_QUERY])
    )
    t.deepEqual(
        s.serialize(FateTypeChannelAddress()),
        new Uint8Array([FateTag.TYPE_OBJECT, FateTag.OTYPE_CHANNEL])
    )
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

test('Serialize composite types', t => {
    t.plan(6)
    t.deepEqual(s.serialize(FateTypeVar(123)), new Uint8Array([FateTag.TYPE_VAR, 123]))
    t.deepEqual(
        s.serialize(FateTypeBytes(512n)),
        new Uint8Array([FateTag.TYPE_BYTES, 111, 130, 1, 192])
    )
    t.deepEqual(
        s.serialize(FateTypeList(FateTypeInt())),
        new Uint8Array([FateTag.TYPE_LIST, FateTag.TYPE_INTEGER])
    )
    t.deepEqual(
        s.serialize(FateTypeMap(FateTypeString(), FateTypeInt())),
        new Uint8Array([FateTag.TYPE_MAP, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER])
    )
    t.deepEqual(
        s.serialize(FateTypeTuple([FateTypeString(), FateTypeInt()])),
        new Uint8Array([FateTag.TYPE_TUPLE, 2, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER])
    )
    t.deepEqual(
        s.serialize(FateTypeVariant([FateTypeString(), FateTypeInt()])),
        new Uint8Array([FateTag.TYPE_VARIANT, 2, FateTag.TYPE_STRING, FateTag.TYPE_INTEGER])
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
