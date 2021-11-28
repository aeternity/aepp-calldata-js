const test = require('../test')
const OracleSerializer = require('../../src/Serializers/OracleSerializer')
const FateOracleAddress = require('../../src/types/FateOracleAddress')
const FateOracleAddressRaw = require('../../src/types/FateOracleAddressRaw')

const s = new OracleSerializer()

test('Serialize', t => {
    t.plan(2)
    t.deepEqual(
        s.serialize(new FateOracleAddressRaw("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,3,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,
            118,84,50,16,254,220,186,152,118,84,50,16]
    )

    t.deepEqual(
        s.serialize(new FateOracleAddress("ok_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt")),
        [159,3,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,
            230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
    )
})

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([159,3,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,
            186,152,118,84,50,16,254,220,186,152,118,84,50,16]),
        new FateOracleAddressRaw("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )

    t.is(
        s.deserialize(
            [159,3,160,222,104,191,225,178,3,229,31,82,53,27,160,135,
                247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
        ).toCanonical(),
        "ok_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt"
    )
})
