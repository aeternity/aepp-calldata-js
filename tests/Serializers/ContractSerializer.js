const test = require('../../src/test.js')
const ContractSerializer = require('../../src/Serializers/ContractSerializer.js')
const FateContractAddress = require('../../src/types/FateContractAddress.js')

const s = new ContractSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateContractAddress("0xfedcba9876543210")),
        [159,2,136,254,220,186,152,118,84,50,16]
    )
});

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,2,136,254,220,186,152,118,84,50,16]),
        new FateContractAddress("0xfedcba9876543210")
    )
});
