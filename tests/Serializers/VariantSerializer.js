const test = require('../test')
const {FateTypeInt} = require('../../src/FateTypes')
const FateInt = require('../../src/types/FateInt')
const FateVariant = require('../../src/types/FateVariant')
const Serializer = require('../../src/Serializer')
const VariantSerializer = require('../../src/Serializers/VariantSerializer')

const s = new VariantSerializer(new Serializer())

test('Serialize', t => {
    t.plan(2)
    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 1, [], [])),
        [175,132,0,0,1,0,1,63]
    )

    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FateTypeInt()])),
        [175,132,0,0,1,0,2,27,14]
    )
});

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([175,132,0,0,1,0,1,63]),
        new FateVariant([0, 0, 1, 0], 1, [], [])
    )

    t.deepEqual(
        s.deserialize([175,132,0,0,1,0,2,27,14]),
        new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FateTypeInt()])
    )
});
