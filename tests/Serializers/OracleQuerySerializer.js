const test = require('../../src/test.js')
const OracleQuerySerializer = require('../../src/Serializers/OracleQuerySerializer.js')
const FateOracleQueryAddress = require('../../src/types/FateOracleQueryAddress.js')

const s = new OracleQuerySerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateOracleQueryAddress("0xfedcba9876543210")),
        [159,4,136,254,220,186,152,118,84,50,16]
    )
});

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,4,136,254,220,186,152,118,84,50,16]),
        new FateOracleQueryAddress("0xfedcba9876543210")
    )
});
