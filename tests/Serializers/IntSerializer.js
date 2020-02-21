const test = require('ava')
const IntSerializer = require('../../src/Serializers/IntSerializer.js')
const FateInt = require('../../src/types/FateInt.js')

const s = new IntSerializer()

test('Serialize', t => {
    t.deepEqual(s.serialize(0), [0])
    t.deepEqual(s.serialize(new FateInt(0)), [0])
    t.deepEqual(s.serialize(63), [126])
    t.deepEqual(s.serialize(-63), [254])
    t.deepEqual(s.serialize(64), [111, 0])
    t.deepEqual(s.serialize(-64), [239, 0])
    t.deepEqual(s.serialize(new FateInt(-64)), [239, 0])
    t.deepEqual(s.serialize(100000), [111, 131, 1, 134, 96])
    t.deepEqual(s.serialize(new FateInt(100000)), [111, 131, 1, 134, 96])
    t.deepEqual(s.serialize(-100000), [239, 131, 1, 134, 96])
    t.deepEqual(
        s.serialize(new FateInt("0xfedcba9876543210")),
        [111,136,254,220,186,152,118,84,49,208]
    )
});
