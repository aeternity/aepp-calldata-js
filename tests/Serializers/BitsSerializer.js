const test = require('ava')
const BitsSerializer = require('../../src/Serializers/BitsSerializer.js')

const s = new BitsSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize(0b10101010), [79,129,170])
});
