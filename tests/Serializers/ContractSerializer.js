const test = require('../test')
const ContractSerializer = require('../../src/Serializers/ContractSerializer')
const FateContractAddress = require('../../src/types/FateContractAddress')

const s = new ContractSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateContractAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,2,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,2,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,
            186,152,118,84,50,16,254,220,186,152,118,84,50,16]),
        new FateContractAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
})
