const test = require('./test')
const Serializer = require('../src/Serializer')
const FateInt = require('../src/types/FateInt')
const FateBool = require('../src/types/FateBool')
const FateString = require('../src/types/FateString')
const FateByteArray = require('../src/types/FateByteArray')
const FateBits = require('../src/types/FateBits')
const FateList = require('../src/types/FateList')
const FateMap = require('../src/types/FateMap')
const FateVariant = require('../src/types/FateVariant')
const FateBytes = require('../src/types/FateBytes')
const FateData = require('../src/types/FateData')
const FateAccountAddress = require('../src/types/FateAccountAddress')
const FateContractAddress = require('../src/types/FateContractAddress')
const FateOracleAddress = require('../src/types/FateOracleAddress')
const FateOracleQueryAddress = require('../src/types/FateOracleQueryAddress')
const FateChannelAddress = require('../src/types/FateChannelAddress')
const {FateTypeInt, FateTypeBool} = require('../src/FateTypes')

const serializer = new Serializer()

function ser(t, input) {
    return serializer.serialize(input)
}

test('Serialize all types', t => {
    t.plan(14)
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
    t.plan(3)

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
