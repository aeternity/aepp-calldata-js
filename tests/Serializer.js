import test from './test.js'
import Serializer from '../src/Serializer.js'
import FateInt from '../src/types/FateInt.js'
import FateBool from '../src/types/FateBool.js'
import FateString from '../src/types/FateString.js'
import FateByteArray from '../src/types/FateByteArray.js'
import FateBits from '../src/types/FateBits.js'
import FateList from '../src/types/FateList.js'
import FateMap from '../src/types/FateMap.js'
import FateTuple from '../src/types/FateTuple.js'
import FateVariant from '../src/types/FateVariant.js'
import FateBytes from '../src/types/FateBytes.js'
import FateData from '../src/types/FateData.js'
import FateAccountAddress from '../src/types/FateAccountAddress.js'
import FateContractAddress from '../src/types/FateContractAddress.js'
import FateOracleAddress from '../src/types/FateOracleAddress.js'
import FateOracleQueryAddress from '../src/types/FateOracleQueryAddress.js'
import FateChannelAddress from '../src/types/FateChannelAddress.js'
import {FateTypeInt, FateTypeBool} from '../src/FateTypes.js'

const serializer = new Serializer()

function ser(t, input) {
    return serializer.serialize(input)
}

function deser(t, input) {
    return serializer.deserialize(new Uint8Array(input))
}

test('Serialize all types', t => {
    t.plan(15)
    // primitive types
    t.deepEqual(ser(t, new FateInt(0)), [0])
    t.deepEqual(ser(t, new FateBool(true)), [255])
    t.deepEqual(ser(t, new FateString("abc")), [13,97,98,99])
    t.deepEqual(ser(t, new FateByteArray()), [95])
    t.deepEqual(ser(t, new FateBits(0b10101010)), [79,129,170])

    // composite types
    const FTInt = FateTypeInt()
    const FTBool = FateTypeBool()

    t.deepEqual(ser(t, new FateList(FTInt)), [3])
    t.deepEqual(ser(t, new FateMap(FTInt, FTBool, [])), [47,0])

    t.deepEqual(
        ser(t, new FateTuple(
            [FTBool, FTBool, FTInt],
            [new FateBool(true), new FateBool(false), new FateInt(0)]
        )),
        [59,255,127,0]
    )

    t.deepEqual(
        ser(t, new FateVariant([0, 0, 1, 0], 1)),
        [175,132,0,0,1,0,1,63]
    )

    // bytes and objects serializers
    t.deepEqual(
        ser(t, new FateBytes(0xbeef)),
        [159,1,9,190,239]
    )
    t.deepEqual(
        ser(t, new FateAccountAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,0,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateContractAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,2,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateOracleAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,3,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateOracleQueryAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,4,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateChannelAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,5,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
})

test('Deserialize all types', t => {
    t.plan(15)

    // primitive types
    t.deepEqual(deser(t, [0]), new FateInt(0))
    t.deepEqual(deser(t, [255]), new FateBool(true))
    t.deepEqual(deser(t, [13,97,98,99]), new FateString("abc"))
    t.deepEqual(deser(t, [95]), new FateString(""))
    t.deepEqual(deser(t, [79,129,170]), new FateBits(0b10101010))

    t.deepEqual(deser(t, [3]), new FateList())
    t.deepEqual(deser(t, [47,0]), new FateMap())

    t.deepEqual(
        deser(t, [59,255,127,0]),
        new FateTuple([], [new FateBool(true), new FateBool(false), new FateInt(0)])
    )

    t.deepEqual(deser(t, [175,132,0,0,1,0,1,63]), new FateVariant([0, 0, 1, 0], 1))

    t.deepEqual(deser(t, [159,1,9,190,239]), new FateBytes(0xbeef))
    t.deepEqual(
        deser(t, [
            159,0,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16
        ]),
        new FateAccountAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
    t.deepEqual(
        deser(t, [
            159,2,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16
        ]),
        new FateContractAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
    t.deepEqual(
        deser(t, [
            159,3,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16
        ]),
        new FateOracleAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
    t.deepEqual(
        deser(t, [
            159,4,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16
        ]),
        new FateOracleQueryAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
    t.deepEqual(
        deser(t, [
            159,5,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16
        ]),
        new FateChannelAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
})

test('Serialize errors', t => {
    t.plan(3)

    t.throws(
        () => serializer.serialize('invalid data'),
        { name: 'SerializerError' }
    )

    t.throws(
        () => serializer.serialize({invalid: 'data'}),
        { name: 'SerializerError' }
    )

    t.throws(
        () => serializer.serialize(new FateData('invalid type')),
        { name: 'SerializerError' }
    )
})

test('Deserialize errors', t => {
    t.plan(4)

    t.throws(
        () => serializer.deserialize('invalid data'),
        { name: 'SerializerError' }
    )

    t.throws(
        () => serializer.deserialize('invalid data'),
        { name: 'SerializerError' }
    )

    t.throws(
        () => serializer.deserialize(new FateData('invalid type')),
        { name: 'SerializerError' }
    )

    t.throws(
        () => serializer.deserializeStream('invalid data'),
        { name: 'SerializerError' }
    )
})
