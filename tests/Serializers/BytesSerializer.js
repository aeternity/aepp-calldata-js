const test = require('ava')
const BytesSerializer = require('../../src/Serializers/BytesSerializer.js')
const FateBytes = require('../../src/types/FateBytes.js')

const s = new BytesSerializer()

test('Serialize', t => {
    t.deepEqual(
        s.serialize(new FateBytes([0xbe, 0xef])),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes(0xbeef)),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("beef")),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("0xbeef")),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("0xfedcba9876543210")),
        [159,1,33,254,220,186,152,118,84,50,16]
    )
});
