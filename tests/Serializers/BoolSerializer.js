const test = require('../../src/test.js')
const FateBool = require('../../src/types/FateBool.js')
const BoolSerializer = require('../../src/Serializers/BoolSerializer.js')

const s = new BoolSerializer()

test('Serialize', t => {
    t.plan(8)
    t.deepEqual(s.serialize(true), [255])
    t.deepEqual(s.serialize(false), [127])

    t.deepEqual(s.serialize(new FateBool(true)), [255])
    t.deepEqual(s.serialize(new FateBool(1)), [255])
    t.deepEqual(s.serialize(new FateBool("qwe")), [255])

    t.deepEqual(s.serialize(new FateBool(false)), [127])
    t.deepEqual(s.serialize(new FateBool(0)), [127])
    t.deepEqual(s.serialize(new FateBool("")), [127])
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
