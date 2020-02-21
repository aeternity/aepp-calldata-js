const test = require('ava')
const ContractSerializer = require('../../src/Serializers/ContractSerializer.js')
const FateContractAddress = require('../../src/types/FateContractAddress.js')

const s = new ContractSerializer()

test('Serialize', t => {
    t.deepEqual(
        s.serialize(new FateContractAddress("0xfedcba9876543210")),
        [159,2,136,254,220,186,152,118,84,50,16]
    )
});
