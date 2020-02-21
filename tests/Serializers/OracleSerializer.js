const test = require('ava')
const OracleSerializer = require('../../src/Serializers/OracleSerializer.js')
const FateOracleAddress = require('../../src/types/FateOracleAddress.js')

const s = new OracleSerializer()

test('Serialize', t => {
    t.deepEqual(
        s.serialize(new FateOracleAddress("0xfedcba9876543210")),
        [159,3,136,254,220,186,152,118,84,50,16]
    )
});
