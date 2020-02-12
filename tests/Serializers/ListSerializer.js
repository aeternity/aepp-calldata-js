const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const ListSerializer = require('../../src/Serializers/ListSerializer.js')

const s = new ListSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(s.serialize(['int', []]), [3], 'empty list')

    t.deepEqual(
        s.serialize(['int', [1,2,3]]),
        [51,2,4,6],
        'short list'
    )

    const longList = [...Array(16).keys()]
    t.deepEqual(
        s.serialize(['int', longList]),
        [31,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long list'
    )
});
