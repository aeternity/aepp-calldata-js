const test = require('../test.js')
const AddressSerializer = require('../../src/Serializers/AddressSerializer.js')
const FateAccountAddress = require('../../src/types/FateAccountAddress.js')

const s = new AddressSerializer()

test('Serialize', t => {
    t.plan(2)
    t.deepEqual(
        s.serialize(new FateAccountAddress("0xfedcba9876543210")),
        [159,0,136,254,220,186,152,118,84,50,16]
    )

    t.deepEqual(
        s.serialize(new FateAccountAddress("ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt")),
        [159,0,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
    )
});

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([159,0,136,254,220,186,152,118,84,50,16]),
        new FateAccountAddress("0xfedcba9876543210")
    )

    t.is(
        s.deserialize([159,0,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]).valueOf(),
        "ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt"
    )
});
