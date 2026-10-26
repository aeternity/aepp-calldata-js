import RLP from 'rlp'
import test from '../test.js'
import {asU8, rlpDecodeStream} from '../../src/utils/stream.js'

const bytes = (length, fill = 7) => new Uint8Array(length).fill(fill)

test('asU8 does not copy a Uint8Array', t => {
    const data = bytes(4)
    t.is(asU8(data), data)
    t.deepEqual(asU8([1, 2, 3]), new Uint8Array([1, 2, 3]))
})

test('rlpDecodeStream decodes like RLP.decode with a remainder', t => {
    const trailing = bytes(10, 9)
    const items = [
        new Uint8Array([0]),
        new Uint8Array([0x7f]),
        new Uint8Array([0x80]),
        bytes(1),
        bytes(55),
        bytes(56),
        bytes(300),
        bytes(70000),
        [bytes(3), bytes(60)],
        [bytes(30), bytes(30)],
        [bytes(300), bytes(300)],
    ]

    t.plan(items.length * 2)
    items.forEach(item => {
        const input = new Uint8Array([...RLP.encode(item), ...trailing])
        const expected = RLP.decode(input, true)
        const actual = rlpDecodeStream(input)

        t.deepEqual(actual.data, expected.data)
        t.deepEqual(new Uint8Array(actual.remainder), new Uint8Array(expected.remainder))
    })
})

test('rlpDecodeStream remainder is a view of the input', t => {
    const input = new Uint8Array([...RLP.encode(bytes(100)), ...bytes(5, 9)])
    const {remainder} = rlpDecodeStream(input)

    t.is(remainder.buffer, input.buffer)
    t.is(remainder.length, 5)
})
