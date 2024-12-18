import test from '../test.js'
import BytesSerializer from '../../src/Serializers/BytesSerializer.js'
import FateBytes from '../../src/types/FateBytes.js'

const s = new BytesSerializer()

test('Serialize', t => {
    t.plan(7)
    t.deepEqual(
        s.serialize(new FateBytes([0xbe, 0xef])),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes(0xbeef)),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("beef")),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("0xbeef")),
        [159,1,9,190,239]
    )

    t.deepEqual(
        s.serialize(new FateBytes("0xfedcba9876543210")),
        [159,1,33,254,220,186,152,118,84,50,16]
    )

    t.throws(
        () => s.serialize(new FateBytes("0xfedcba9876543210", 32)),
        { name: 'FateTypeError' }
    )

    t.throws(
        () => s.serialize(new FateBytes({})),
        { name: 'FateTypeError' }
    )
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,1,9,190,239]),
        new FateBytes(0xbeef)
    )
})
