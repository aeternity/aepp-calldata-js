import test from '../test.js'
import Serializer from '../../src/Serializer.js'
import TupleSerializer from '../../src/Serializers/TupleSerializer.js'
import FateInt from '../../src/types/FateInt.js'
import FateBool from '../../src/types/FateBool.js'
import FateTuple from '../../src/types/FateTuple.js'
import {FateTypeInt, FateTypeBool} from '../../src/FateTypes.js'

const s = new TupleSerializer(new Serializer())
const FTInt = FateTypeInt()
const FTBool = FateTypeBool()

test('Serialize', t => {
    t.plan(5)
    t.deepEqual(
        s.serialize(new FateTuple()),
        [63],
        'empty tuple'
    )

    t.deepEqual(
        s.serialize(new FateTuple(
            [FTInt],
            [new FateInt(0)]
        )),
        [27,0],
        'single element tuple'
    )

    t.deepEqual(
        s.serialize(new FateTuple(
            [FTBool, FTBool, FTInt],
            [new FateBool(true), new FateBool(false), new FateInt(0)]
        )),
        [59,255,127,0],
        'short tuple'
    )

    const longTuple = [...Array(16).keys()].map(e => new FateInt(e))
    const types = Array(16).fill(FTInt)

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
})

test('Deserialize', t => {
    t.plan(4)
    t.deepEqual(
        s.deserialize([63]),
        new FateTuple(),
        'empty tuple'
    )

    t.deepEqual(
        s.deserialize([59,255,127,0]),
        new FateTuple(
            [FTBool, FTBool, FTInt],
            [new FateBool(true), new FateBool(false), new FateInt(0)]
        ),
        'short tuple'
    )

    const longTuple = [...Array(16).keys()].map(e => new FateInt(e))
    const types = Array(16).fill(FTInt)

    t.deepEqual(
        s.deserialize([11,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]),
        new FateTuple(types, longTuple),
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
        s.deserialize([43,43,127,0,43,255,2]),
        new FateTuple(
            [t1.type, t2.type],
            [t1, t2]
        ),
        'nested tuple'
    )
})
