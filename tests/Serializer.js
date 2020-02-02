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
    t.deepEqual(ser(t, ['int', 63]), [126])
    t.deepEqual(ser(t, ['int', -63]), [254])
    t.deepEqual(ser(t, ['int', 64]), [111, 0])
    t.deepEqual(ser(t, ['int', -64]), [239, 0])
    t.deepEqual(ser(t, ['int', 100000]), [111, 131, 1, 134, 96])
    t.deepEqual(ser(t, ['int', -100000]), [239, 131, 1, 134, 96])
});

test('Serialize tuples', t => {
    t.deepEqual(ser(t, ['tuple', []]), [63], 'empty tuple')
    t.deepEqual(
        ser(t, ['tuple', [['bool', true], ['bool', false]]]),
        [43, [255], [127]],
        'short tuple'
    )
    //todo: long tuple
});

test('Serialize byte array', t => {
    t.deepEqual(ser(t, ['byte_array', []]), [95], 'empty byte_array')
    t.deepEqual(
        ser(t, ['byte_array', [1, 2, 3, 4]]),
        [17, 1, 2, 3, 4],
        'short byte_array'
    )
    //todo: long byte array
});
