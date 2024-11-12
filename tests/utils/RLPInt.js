import test from '../test.js'
import {encode} from '../../src/utils/RLPInt.js'

const b = (value) => new Uint8Array(value)

test('RLP Encode Integer', t => {
    t.plan(8)
    t.deepEqual(encode(0), b([0]))
    t.deepEqual(encode(1), b([1]))
    t.deepEqual(encode(127), b([127]))
    t.deepEqual(encode(128), b([129, 128]))
    t.deepEqual(encode(255), b([129, 255]))
    t.deepEqual(encode(256), b([130, 1, 0]))
    t.deepEqual(encode(100000), b([131, 1, 134, 160]))
    t.deepEqual(
        encode(10000000000000009999999n),
        b([138,2,30,25,224,201,186,178,216,150,127])
    )
})
