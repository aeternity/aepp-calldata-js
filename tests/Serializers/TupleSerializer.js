const test = require('ava')
const {FateTypeTuple, FateTypeInt, FateTypeBool} = require('../../src/FateTypes.js')
const Serializer = require('../../src/Serializer.js')
const TupleSerializer = require('../../src/Serializers/TupleSerializer.js')

const s = new TupleSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(
        s.serialize([FateTypeTuple(), []]),
        [63],
        'empty tuple'
    )

    const t1 = FateTypeTuple([FateTypeBool(), FateTypeBool(), FateTypeInt()])
    t.deepEqual(
        s.serialize([t1, [true, false, 0]]),
        [59,255,127,0],
        'short tuple'
    )

    let longTuple = [...Array(16).keys()]
    let types = Array(16).fill(FateTypeInt())

    t.deepEqual(
        s.serialize([FateTypeTuple(types), longTuple]),
        [11,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long tuple'
    )
});
