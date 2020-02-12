const test = require('ava')
const BoolSerializer = require('../../src/Serializers/BoolSerializer.js')

const s = new BoolSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize(true), [255])
    t.deepEqual(s.serialize(false), [127])
});
