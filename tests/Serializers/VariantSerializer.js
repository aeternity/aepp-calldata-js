const test = require('ava')
const Serializer = require('../../src/Serializer.js')
const VariantSerializer = require('../../src/Serializers/VariantSerializer.js')

const s = new VariantSerializer(Object.create(Serializer))

test('Serialize', t => {
    t.deepEqual(
        s.serialize({
            arities: [0, 0, 1, 0],
            tag: 1,
            variantValues: []
        }),
        [175,132,0,0,1,0,1,63]
    )

    t.deepEqual(
        s.serialize({
            arities: [0, 0, 1, 0],
            tag: 2,
            variantValues: [['int', 7]]
        }),
        [175,132,0,0,1,0,2,27,14]
    )
});
