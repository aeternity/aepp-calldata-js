import test from '../test.js'
import FateBool from '../../src/types/FateBool.js'
import BoolSerializer from '../../src/Serializers/BoolSerializer.js'

const s = new BoolSerializer()

test('Serialize', t => {
    t.plan(8)
    t.deepEqual(s.serialize(true), [255])
    t.deepEqual(s.serialize(false), [127])

    t.deepEqual(s.serialize(new FateBool(true)), [255])
    t.deepEqual(s.serialize(new FateBool(1)), [255])
    t.deepEqual(s.serialize(new FateBool('qwe')), [255])

    t.deepEqual(s.serialize(new FateBool(false)), [127])
    t.deepEqual(s.serialize(new FateBool(0)), [127])
    t.deepEqual(s.serialize(new FateBool('')), [127])
})

test('Deserialize', t => {
    t.plan(5)
    const T = new FateBool(true)
    const F = new FateBool(false)

    t.deepEqual(s.deserialize([255]), T)
    t.deepEqual(s.deserialize([127]), F)

    t.deepEqual(s.deserialize(new Uint8Array([255])), T)
    t.deepEqual(s.deserialize(new Uint8Array([127])), F)

    t.throws(() => s.deserialize([0b01010101]), {name: 'FatePrefixError'})
})
