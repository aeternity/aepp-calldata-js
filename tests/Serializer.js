const test = require('ava')
const Serializer = require('../src/Serializer.js')
const FateList = require('../src/types/FateList.js')
const FateMap = require('../src/types/FateMap.js')
const FateBytes = require('../src/types/FateBytes.js')
const FateAccountAddress = require('../src/types/FateAccountAddress.js')
const FateContractAddress = require('../src/types/FateContractAddress.js')
const FateOracleAddress = require('../src/types/FateOracleAddress.js')
const FateOracleQueryAddress = require('../src/types/FateOracleQueryAddress.js')
const FateChannelAddress = require('../src/types/FateChannelAddress.js')

const {
    FateTypeInt,
    FateTypeBool,
    FateTypeVariant,
} = require('../src/FateTypes.js')

function ser(t, input) {
    return t.context.serializer.serialize(input)
}

test.before(async t => {
    t.context.serializer = Object.create(Serializer)
});

test('Serialize all types', t => {
    // primitive types
    t.deepEqual(ser(t, ['int', 0]), [0])
    t.deepEqual(ser(t, ['bool', true]), [255])
    t.deepEqual(ser(t, ['string', "abc"]), [13,97,98,99])
    t.deepEqual(ser(t, ['byte_array', []]), [95])
    t.deepEqual(ser(t, ['bits', 0b10101010]), [79,129,170])

    // composite types
    const FTInt = FateTypeInt()
    const FTBool = FateTypeBool()
    const variantType = FateTypeVariant([0, 0, 1, 0], [FTInt, FTInt, FTInt, FTInt])

    t.deepEqual(ser(t, new FateList(FTInt)), [3])
    t.deepEqual(ser(t, new FateMap(FTInt, FTBool, [])), [47,0])
    t.deepEqual(
        ser(t, [variantType, {tag: 1, variantValues: []}]),
        [175,132,0,0,1,0,1,63]
    )

    // bytes and objects serializers
    t.deepEqual(
        ser(t, new FateBytes(0xbeef)),
        [159,1,9,190,239]
    )
    t.deepEqual(
        ser(t, new FateAccountAddress("0xfedcba9876543210")),
        [159,0,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateContractAddress("0xfedcba9876543210")),
        [159,2,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateOracleAddress("0xfedcba9876543210")),
        [159,3,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateOracleQueryAddress("0xfedcba9876543210")),
        [159,4,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, new FateChannelAddress("0xfedcba9876543210")),
        [159,5,136,254,220,186,152,118,84,50,16]
    )
});
