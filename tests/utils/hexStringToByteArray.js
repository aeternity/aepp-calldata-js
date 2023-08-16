const test = require('../test')
const hexStringToByteArray = require('../../src/utils/hexStringToByteArray')

const b = (value) => new Uint8Array(value)

test('hexStringToByteArray', t => {
    t.plan(7)
    t.deepEqual(hexStringToByteArray(''), b([]))
    t.deepEqual(hexStringToByteArray('0x'), b([]))
    t.deepEqual(hexStringToByteArray('1'), b([1]))
    t.deepEqual(hexStringToByteArray('01'), b([1]))
    t.deepEqual(hexStringToByteArray('0x01'), b([1]))
    t.deepEqual(hexStringToByteArray('c0ffee'), b([192, 255, 238]))
    t.throws(() => hexStringToByteArray('coffee'), { message: 'Invalid hex string: coffee' })
})
