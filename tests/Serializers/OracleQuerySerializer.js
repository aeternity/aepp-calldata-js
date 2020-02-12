const test = require('ava')
const OracleQuerySerializer = require('../../src/Serializers/OracleQuerySerializer.js')

const s = new OracleQuerySerializer()

test('Serialize', t => {
    t.deepEqual(
        s.serialize(BigInt("0xfedcba9876543210")),
        [159,4,136,254,220,186,152,118,84,50,16]
    )
});
