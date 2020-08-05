const test = require('../../src/test.js')
const AddressSerializer = require('../../src/Serializers/AddressSerializer.js')
const FateAccountAddress = require('../../src/types/FateAccountAddress.js')

const s = new AddressSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateAccountAddress("0xfedcba9876543210")),
        [159,0,136,254,220,186,152,118,84,50,16]
    )
});

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,0,136,254,220,186,152,118,84,50,16]),
        new FateAccountAddress("0xfedcba9876543210")
    )
});
