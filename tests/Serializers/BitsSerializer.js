import test from '../test.js'
import BitsSerializer from '../../src/Serializers/BitsSerializer.js'
import FateBits from '../../src/types/FateBits.js'

const s = new BitsSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(s.serialize(new FateBits(0b10101010)), [79,129,170])
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(s.deserialize([79,129,170]), new FateBits(0b10101010))
})
