const test = require('ava')
const {FateTypeInt} = require('../../src/FateTypes.js')
const FateInt = require('../../src/types/FateInt.js')
const FateVariant = require('../../src/types/FateVariant.js')
const Serializer = require('../../src/Serializer.js')
const VariantSerializer = require('../../src/Serializers/VariantSerializer.js')

const s = new VariantSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 1, [], [])),
        [175,132,0,0,1,0,1,63]
    )

    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FateTypeInt()])),
        [175,132,0,0,1,0,2,27,14]
    )
});
