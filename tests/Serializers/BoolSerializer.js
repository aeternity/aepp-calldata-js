const test = require('ava')
const FateBool = require('../../src/types/FateBool.js')
const BoolSerializer = require('../../src/Serializers/BoolSerializer.js')

const s = new BoolSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize(true), [255])
    t.deepEqual(s.serialize(false), [127])

    t.deepEqual(s.serialize(new FateBool(true)), [255])
    t.deepEqual(s.serialize(new FateBool(1)), [255])
    t.deepEqual(s.serialize(new FateBool("qwe")), [255])

    t.deepEqual(s.serialize(new FateBool(false)), [127])
    t.deepEqual(s.serialize(new FateBool(0)), [127])
    t.deepEqual(s.serialize(new FateBool("")), [127])
});
