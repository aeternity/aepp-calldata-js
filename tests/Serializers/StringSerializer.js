const test = require('../test')
const FateString = require('../../src/types/FateString')
const StringSerializer = require('../../src/Serializers/StringSerializer')

const s = new StringSerializer()

test('Serialize', t => {
    t.plan(3)
    t.deepEqual(s.serialize(new FateString("abc")), [13,97,98,99])
    t.deepEqual(s.serialize("abc"), [13,97,98,99])
    t.deepEqual(
        s.serialize("x".repeat(64)),
        [1,0].concat(Array(64).fill(120))
    )
})

test('Deserialize', t => {
    t.plan(3)
    t.deepEqual(s.deserialize([13,97,98,99]), new FateString("abc"))
    t.deepEqual(
        s.deserialize([1,0].concat(Array(64).fill(120))),
        new FateString("x".repeat(64))
    )
    t.deepEqual(s.deserialize([95]), new FateString(""))
})
