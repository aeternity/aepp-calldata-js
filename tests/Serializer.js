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
