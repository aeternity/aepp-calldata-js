const test = require('../test.js')
const HexStringToByteArray = require('../../src/utils/HexStringToByteArray.js')

const b = (value) => new Uint8Array(value)

test('HexStringToByteArray', t => {
    t.plan(7)
    t.deepEqual(HexStringToByteArray(''), b([]))
    t.deepEqual(HexStringToByteArray('0x'), b([]))
    t.deepEqual(HexStringToByteArray('1'), b([1]))
    t.deepEqual(HexStringToByteArray('01'), b([1]))
    t.deepEqual(HexStringToByteArray('0x01'), b([1]))
    t.deepEqual(HexStringToByteArray('c0ffee'), b([192, 255, 238]))
    t.throws(() => HexStringToByteArray('coffee'), { message: 'Invalid hex string: coffee' })
})
