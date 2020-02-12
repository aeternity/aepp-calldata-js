const test = require('ava')
const BytesSerializer = require('../../src/Serializers/BytesSerializer.js')

const s = new BytesSerializer()

test('Serialize', t => {
    t.deepEqual(
        s.serialize(0xbeef),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(BigInt("0xfedcba9876543210")),
        [159,1,33,254,220,186,152,118,84,50,16]
    )
});
