import test from '../test.js'
import FateString from '../../src/types/FateString.js'
import StringSerializer from '../../src/Serializers/StringSerializer.js'

const s = new StringSerializer()

test('Serialize', t => {
    t.plan(4)
    t.deepEqual(s.serialize(new FateString('abc')), [13, 97, 98, 99])
    t.deepEqual(s.serialize('abc'), [13, 97, 98, 99])
    t.deepEqual(s.serialize('x'.repeat(64)), [1, 0].concat(Array(64).fill(120)))
    t.deepEqual(s.serialize(new FateString(new Uint8Array([253, 254, 255]))), [13, 253, 254, 255])
})

test('Deserialize', t => {
    t.plan(5)
    t.deepEqual(s.deserialize([13, 97, 98, 99]), new FateString('abc'))
    t.deepEqual(s.deserialize([1, 0].concat(Array(64).fill(120))), new FateString('x'.repeat(64)))
    t.deepEqual(s.deserialize([95]), new FateString(''))
    t.throws(() => s.deserialize([0b00001011]), {name: 'FatePrefixError'})
    t.deepEqual(s.deserialize([13, 253, 254, 255]), new FateString(new Uint8Array([253, 254, 255])))
})
