import test from '../test.js'
import OracleQuerySerializer from '../../src/Serializers/OracleQuerySerializer.js'
import FateOracleQueryAddress from '../../src/types/FateOracleQueryAddress.js'

const s = new OracleQuerySerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateOracleQueryAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,4,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,4,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,
            186,152,118,84,50,16,254,220,186,152,118,84,50,16]),
        new FateOracleQueryAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
})
