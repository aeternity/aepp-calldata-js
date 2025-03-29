import test from '../test.js'
import OracleSerializer from '../../src/Serializers/OracleSerializer.js'
import FateOracleAddress from '../../src/types/FateOracleAddress.js'

const s = new OracleSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(
            new FateOracleAddress(
                '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'
            )
        ),
        [
            159, 3, 160, 254, 220, 186, 152, 118, 84, 50, 16, 254, 220, 186, 152, 118, 84, 50, 16,
            254, 220, 186, 152, 118, 84, 50, 16, 254, 220, 186, 152, 118, 84, 50, 16,
        ]
    )
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([
            159, 3, 160, 254, 220, 186, 152, 118, 84, 50, 16, 254, 220, 186, 152, 118, 84, 50, 16,
            254, 220, 186, 152, 118, 84, 50, 16, 254, 220, 186, 152, 118, 84, 50, 16,
        ]),
        new FateOracleAddress('0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210')
    )
})
