const test = require('../test')
const {Int2ByteArray, ByteArray2Int} = require('../../src/utils/Int2ByteArray')

const b = (value) => new Uint8Array(value)

test('Int2ByteArray', t => {
    t.plan(10)
    t.deepEqual(Int2ByteArray(0), b([0]))
    t.deepEqual(Int2ByteArray(1), b([1]))
    t.deepEqual(Int2ByteArray(255), b([255]))
    t.deepEqual(Int2ByteArray(256), b([1, 0]))
    t.deepEqual(Int2ByteArray(300), b([1, 44]))
    t.deepEqual(Int2ByteArray(511), b([1, 255]))
    t.deepEqual(Int2ByteArray(512), b([2, 0]))
    t.deepEqual(Int2ByteArray(552), b([2, 40]))
    t.deepEqual(Int2ByteArray(100000), b([1, 134, 160]))
    t.deepEqual(
        Int2ByteArray(10000000000000009999999n),
        b([2,30,25,224,201,186,178,216,150,127])
    )
});

test('ByteArray2Int', t => {
    t.plan(10)
    t.deepEqual(ByteArray2Int([0]), 0n)
    t.deepEqual(ByteArray2Int([1]), 1n)
    t.deepEqual(ByteArray2Int([255]), 255n)
    t.deepEqual(ByteArray2Int([1, 0]), 256n)
    t.deepEqual(ByteArray2Int([1, 44]), 300n)
    t.deepEqual(ByteArray2Int([1, 255]), 511n)
    t.deepEqual(ByteArray2Int([2, 0]), 512n)
    t.deepEqual(ByteArray2Int([2, 40]), 552n)
    t.deepEqual(ByteArray2Int([1, 134, 160]), 100000n)
    t.deepEqual(
        ByteArray2Int([2,30,25,224,201,186,178,216,150,127]),
        10000000000000009999999n
    )
});
