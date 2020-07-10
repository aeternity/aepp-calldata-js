const test = require('ava')
const BitsSerializer = require('../../src/Serializers/BitsSerializer.js')
const FateBits = require('../../src/types/FateBits.js')

const s = new BitsSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize(new FateBits(0b10101010)), [79,129,170])
});

test('Deserialize', t => {
    t.deepEqual(s.deserialize([79,129,170]), new FateBits(0b10101010))
});
