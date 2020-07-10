const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const TupleSerializer = require('../../src/Serializers/TupleSerializer.js')
const FateInt = require('../../src/types/FateInt.js')
const FateBool = require('../../src/types/FateBool.js')
const FateTuple = require('../../src/types/FateTuple.js')
const {FateTypeInt, FateTypeBool} = require('../../src/FateTypes.js')

const s = new TupleSerializer(new Serializer())

test('Serialize', t => {
    const FTInt = FateTypeInt(), FTBool = FateTypeBool()

    t.deepEqual(
        s.serialize(new FateTuple()),
        [63],
        'empty tuple'
    )

    t.deepEqual(
        s.serialize(new FateTuple(
            [FTBool, FTBool, FTInt],
            [new FateBool(true), new FateBool(false), new FateInt(0)]
        )),
        [59,255,127,0],
        'short tuple'
    )

    let longTuple = [...Array(16).keys()].map(e => new FateInt(e))
    let types = Array(16).fill(FTInt)

    t.deepEqual(
        s.serialize(new FateTuple(types, longTuple)),
        [11,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long tuple'
    )

    const t1 = new FateTuple(
        [FTBool, FTInt],
        [new FateBool(false), new FateInt(0)]
    )
    const t2 = new FateTuple(
        [FTBool, FTInt],
        [new FateBool(true), new FateInt(1)]
    )

    t.deepEqual(
        s.serialize(new FateTuple(
            [t1.type, t2.type],
            [t1, t2]
        )),
        [43,43,127,0,43,255,2],
        'nested tuple'
    )
});
