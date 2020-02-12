const test = require('ava')
const Serializer = require('../src/Serializer.js')

function ser(t, input) {
    return t.context.serializer.serialize(input)
}

test.before(async t => {
    t.context.serializer = Object.create(Serializer)
});

test('Serialize all types', t => {
    t.deepEqual(ser(t, ['bool', true]), [255])
    t.deepEqual(ser(t, ['int', 0]), [0])
    t.deepEqual(ser(t, ['list', ['int', []]]), [3])
    t.deepEqual(ser(t, ['map', ['int', 'bool', []]]), [47,0])
    t.deepEqual(ser(t, ['byte_array', []]), [95])
    t.deepEqual(ser(t, ['string', "abc"]), [13,97,98,99])
    t.deepEqual(ser(t, ['bits', 0b10101010]), [79,129,170])
    t.deepEqual(
        ser(t, ['variant', {
            arities: [0, 0, 1, 0],
            tag: 1,
            variantValues: []
        }]),
        [175,132,0,0,1,0,1,63]
    )
    t.deepEqual(
        ser(t, ['bytes', 0xbeef]),
        [159,1,9,190,239]
    )
    t.deepEqual(
        ser(t, ['address', BigInt("0xfedcba9876543210")]),
        [159,0,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, ['contract', BigInt("0xfedcba9876543210")]),
        [159,2,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, ['oracle', BigInt("0xfedcba9876543210")]),
        [159,3,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, ['oracle_query', BigInt("0xfedcba9876543210")]),
        [159,4,136,254,220,186,152,118,84,50,16]
    )
    t.deepEqual(
        ser(t, ['channel', BigInt("0xfedcba9876543210")]),
        [159,5,136,254,220,186,152,118,84,50,16]
    )
});
