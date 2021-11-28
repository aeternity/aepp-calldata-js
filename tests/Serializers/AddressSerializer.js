const test = require('../test')
const AddressSerializer = require('../../src/Serializers/AddressSerializer')
const FateAccountAddress = require('../../src/types/FateAccountAddress')
const FateAccountAddressRaw = require('../../src/types/FateAccountAddressRaw')

const s = new AddressSerializer()

test('Serialize', t => {
    t.plan(3)
    t.deepEqual(
        s.serialize(new FateAccountAddressRaw("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,0,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )

    t.deepEqual(
        s.serialize(new FateAccountAddress("ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt")),
        [159,0,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,
            230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
    )

    t.throws(
        () => s.serialize(new FateAccountAddress("err_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt")),
        { name: 'FATE_TYPE_ERROR' }
    )
})

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([159,0,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,
            186,152,118,84,50,16,254,220,186,152,118,84,50,16]),
        new FateAccountAddressRaw("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )

    t.is(
        s.deserialize(
            [159,0,160,222,104,191,225,178,3,229,31,82,53,27,160,135,
                247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
        ).toCanonical(),
        "ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt"
    )
})
