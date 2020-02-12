const test = require('ava')
const StringSerializer = require('../../src/Serializers/StringSerializer.js')

const s = new StringSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize("abc"), [13,97,98,99])
    t.deepEqual(
        s.serialize("x".repeat(64)),
        [1,0].concat(Array(64).fill(120))
    )
});
