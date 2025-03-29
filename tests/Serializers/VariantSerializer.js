import test from '../test.js'
import {FateTypeInt} from '../../src/FateTypes.js'
import FateInt from '../../src/types/FateInt.js'
import FateVariant from '../../src/types/FateVariant.js'
import Serializer from '../../src/Serializer.js'
import VariantSerializer from '../../src/Serializers/VariantSerializer.js'

const s = new VariantSerializer(new Serializer())

test('Serialize', t => {
    t.plan(2)
    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 1, [], [])),
        [175, 132, 0, 0, 1, 0, 1, 63]
    )

    t.deepEqual(
        s.serialize(new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FateTypeInt()])),
        [175, 132, 0, 0, 1, 0, 2, 27, 14]
    )
})

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([175, 132, 0, 0, 1, 0, 1, 63]),
        new FateVariant([0, 0, 1, 0], 1, [], [])
    )

    t.deepEqual(
        s.deserialize([175, 132, 0, 0, 1, 0, 2, 27, 14]),
        new FateVariant([0, 0, 1, 0], 2, [new FateInt(7)], [FateTypeInt()])
    )
})
