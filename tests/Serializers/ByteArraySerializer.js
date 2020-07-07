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
    // console.log('long bytes', s.serialize(longBytes))
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

test('Deserialize Stream', t => {
    const longBytes = [...Array(64).keys()]

    t.deepEqual(
        s.deserializeStream([95, 5, 5, 5]),
        [new FateByteArray([]), new Uint8Array([5, 5, 5])],
        'empty byte_array'
    )

    t.deepEqual(
        s.deserializeStream([17, 1, 2, 3, 4, 5, 5, 5]),
        [new FateByteArray([1, 2, 3, 4]), new Uint8Array([5, 5, 5])],
        'short byte_array'
    )

    t.deepEqual(
        s.deserializeStream([
           1,  0,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
          10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
          22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
          34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
          46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
          58, 59, 60, 61, 62, 63, 5, 5, 5
        ]),
        [new FateByteArray(longBytes), new Uint8Array([5,5,5])],
        'long byte_array'
    )
});

test('Deserialize', t => {
    t.deepEqual(s.deserialize([95]), new FateByteArray([]), 'empty byte_array')

    t.deepEqual(
        s.deserialize([17, 1, 2, 3, 4]),
        new FateByteArray([1, 2, 3, 4]),
        'short byte_array'
    )

    const longBytes = [...Array(64).keys()]
    t.deepEqual(
        s.deserialize([1, 0].concat(longBytes)),
        new FateByteArray(longBytes),
        'long byte_array > 64, short int (len - 64 < 64)'
    )

    const longerBytes = [...Array(128).keys()]
    t.deepEqual(
        s.deserialize([1, 111, 0].concat(longerBytes)),
        new FateByteArray(longerBytes),
        'long byte_array > 63, long int (len - 64 > 63)'
    )

    const hugeBytes = [...Array(250).keys()]
    t.deepEqual(
        s.deserialize([1, 111, 122].concat(hugeBytes)),
        new FateByteArray(hugeBytes),
        'very long byte_array > 63'
    )
});
