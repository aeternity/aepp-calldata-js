const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const TupleSerializer = require('../../src/Serializers/TupleSerializer.js')

const s = new TupleSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(s.serialize([]), [63], 'empty tuple')
    t.deepEqual(
        s.serialize([['bool', true], ['bool', false], ['int', 0]]),
        [59,255,127,0],
        'short tuple'
    )

    let longTuple = []
    for (let i = 0; i < 16; i++) {
        longTuple.push(['int', i])
    }

    t.deepEqual(
        s.serialize(longTuple),
        [11,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long tuple'
    )
});
