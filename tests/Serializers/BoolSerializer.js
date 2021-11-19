const test = require('../test')
const FateBool = require('../../src/types/FateBool')
const BoolSerializer = require('../../src/Serializers/BoolSerializer')

const s = new BoolSerializer()

test('Serialize', t => {
    t.plan(8)
    t.deepEqual(s.serialize(true), [255])
    t.deepEqual(s.serialize(false), [127])

    t.deepEqual(s.serialize(new FateBool(true)), [255])
    t.throws(() => s.serialize(new FateBool(1)), { message: '"1" must be a boolean' })
    t.throws(() => s.serialize(new FateBool("qwe")), { message: '"qwe" must be a boolean' })

    t.deepEqual(s.serialize(new FateBool(false)), [127])
    t.throws(() => s.serialize(new FateBool(0)), { message: '"0" must be a boolean' })
    t.throws(() => s.serialize(new FateBool("")), { message: '"" must be a boolean' })
});

test('Deserialize', t => {
    t.plan(4)
    const T = new FateBool(true)
    const F = new FateBool(false)

    t.deepEqual(s.deserialize([255]), T)
    t.deepEqual(s.deserialize([127]), F)

    t.deepEqual(s.deserialize(new Uint8Array([255])), T)
    t.deepEqual(s.deserialize(new Uint8Array([127])), F)
});
