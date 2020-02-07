const test = require('ava')
const Serializer = require('../Serializer.js')

function ser(t, input) {
    return t.context.serializer.serialize(input)
}

test.before(async t => {
    t.context.serializer = Object.create(Serializer)
});

test('Serialize booleans', t => {
    t.deepEqual(ser(t, ['bool', true]), [255])
    t.deepEqual(ser(t, ['bool', false]), [127])
});

test('Encode unsigned', t => {
    t.deepEqual(t.context.serializer.encodeUnsigned(0), [0])
    t.deepEqual(t.context.serializer.encodeUnsigned(1), [1])
    t.deepEqual(t.context.serializer.encodeUnsigned(255), [255])
    t.deepEqual(t.context.serializer.encodeUnsigned(256), [1, 0])
    t.deepEqual(t.context.serializer.encodeUnsigned(300), [1, 44])
    t.deepEqual(t.context.serializer.encodeUnsigned(511), [1, 255])
    t.deepEqual(t.context.serializer.encodeUnsigned(512), [2, 0])
    t.deepEqual(t.context.serializer.encodeUnsigned(552), [2, 40])
    t.deepEqual(t.context.serializer.encodeUnsigned(100000), [1, 134, 160])
});

test('RLP Encode Unsigned', t => {
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(0), [0])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(1), [1])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(127), [127])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(128), [129, 128])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(255), [129, 255])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(256), [130, 1, 0])
    t.deepEqual(t.context.serializer.rlpEncodeUnsigned(100000), [131, 1, 134, 160])
});

test('Serialize integers', t => {
    t.deepEqual(ser(t, ['int', 0]), [0])
    t.deepEqual(ser(t, ['int', 63]), [126])
    t.deepEqual(ser(t, ['int', -63]), [254])
    t.deepEqual(ser(t, ['int', 64]), [111, 0])
    t.deepEqual(ser(t, ['int', -64]), [239, 0])
    t.deepEqual(ser(t, ['int', 100000]), [111, 131, 1, 134, 96])
    t.deepEqual(ser(t, ['int', -100000]), [239, 131, 1, 134, 96])
});

test('Serialize lists', t => {
    t.deepEqual(ser(t, ['list', ['int', []]]), [3], 'empty list')

    t.deepEqual(
        ser(t, ['list', ['int', [1,2,3]]]),
        [51,2,4,6],
        'short list'
    )

    const longList = [...Array(16).keys()]
    t.deepEqual(
        ser(t, ['list', ['int', longList]]),
        [31,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long list'
    )
});

test('Serialize maps', t => {
    t.deepEqual(ser(t, ['map', ['int', 'bool', []]]), [47,0], 'empty map')

    t.deepEqual(
        ser(t, [
            'map',
            ['int', 'bool', [[0, false]]]
        ]),
        [47,1,0,127],
        'single element map'
    )

    t.deepEqual(
        ser(t, [
            'map',
            ['int', 'bool', [[0,false], [1,true], [3,true]]]
        ]),
        [47,3,0,127,2,255,6,255]
    )
});

test('Serialize tuples', t => {
    t.deepEqual(ser(t, ['tuple', []]), [63], 'empty tuple')
    t.deepEqual(
        ser(t, ['tuple', [['bool', true], ['bool', false], ['int', 0]]]),
        [59,255,127,0],
        'short tuple'
    )

    let longTuple = []
    for (let i = 0; i < 16; i++) {
        longTuple.push(['int', i])
    }

    t.deepEqual(
        ser(t, ['tuple', longTuple]),
        [11,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],
        'long tuple'
    )
});

test('Serialize byte array', t => {
    t.deepEqual(ser(t, ['byte_array', []]), [95], 'empty byte_array')
    t.deepEqual(
        ser(t, ['byte_array', [1, 2, 3, 4]]),
        [17, 1, 2, 3, 4],
        'short byte_array'
    )

    const longBytes = [...Array(64).keys()]
    t.deepEqual(
        ser(t, ['byte_array', longBytes]),
        [1, 0].concat(longBytes),
        'long byte_array > 64, short int (len - 64 < 64)'
    )

    const longerBytes = [...Array(128).keys()]
    t.deepEqual(
        ser(t, ['byte_array', longerBytes]),
        [1, 111, 0].concat(longerBytes),
        'long byte_array > 63, long int (len - 64 > 63)'
    )

    const hugeBytes = [...Array(250).keys()]
    t.deepEqual(
        ser(t, ['byte_array', hugeBytes]),
        [1, 111, 122].concat(hugeBytes),
        'very long byte_array > 63'
    )
});

test('Serialize string', t => {
    t.deepEqual(ser(t, ['string', "abc"]), [13,97,98,99])
    t.deepEqual(
        ser(t, ['string', "x".repeat(64)]),
        [1,0].concat(Array(64).fill(120))
    )
});


test('Serialize bits', t => {
    t.deepEqual(ser(t, ['bits', 0b10101010]), [79,129,170])
});


test('Serialize variant', t => {
    t.deepEqual(
        ser(t, ['variant', {
            arities: [0, 0, 1, 0],
            tag: 1,
            variantValues: []
        }]),
        [175,132,0,0,1,0,1,63]
    )

    t.deepEqual(
        ser(t, ['variant', {
            arities: [0, 0, 1, 0],
            tag: 2,
            variantValues: [['int', 7]]
        }]),
        [175,132,0,0,1,0,2,27,14]
    )
});
