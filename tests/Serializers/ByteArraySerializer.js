const test = require('ava')
const ByteArraySerializer = require('../../src/Serializers/ByteArraySerializer.js')
const FateByteArray = require('../../src/types/FateByteArray.js')

const s = new ByteArraySerializer()

test('Serialize FateByteArray', t => {
    const longBytes = [...Array(64).keys()]

    t.deepEqual(s.serialize(new FateByteArray([])), [95], 'empty byte_array')

    t.deepEqual(
        s.serialize(new FateByteArray([1, 2, 3, 4])),
        [17, 1, 2, 3, 4],
        'short byte_array'
    )

    t.deepEqual(
        s.serialize(new FateByteArray(longBytes)),
        [1, 0].concat(longBytes),
        'long byte_array > 64, short int (len - 64 < 64)'
    )
});

test('Serialize plain array', t => {
    t.deepEqual(s.serialize([]), [95], 'empty byte_array')

    t.deepEqual(
        s.serialize([1, 2, 3, 4]),
        [17, 1, 2, 3, 4],
        'short byte_array'
    )

    const longBytes = [...Array(64).keys()]
    t.deepEqual(
        s.serialize(longBytes),
        [1, 0].concat(longBytes),
        'long byte_array > 64, short int (len - 64 < 64)'
    )

    const longerBytes = [...Array(128).keys()]
    t.deepEqual(
        s.serialize(longerBytes),
        [1, 111, 0].concat(longerBytes),
        'long byte_array > 63, long int (len - 64 > 63)'
    )

    const hugeBytes = [...Array(250).keys()]
    t.deepEqual(
        s.serialize(hugeBytes),
        [1, 111, 122].concat(hugeBytes),
        'very long byte_array > 63'
    )
});
