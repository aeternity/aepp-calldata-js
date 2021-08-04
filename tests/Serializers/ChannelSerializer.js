const test = require('../test.js')
const ChannelSerializer = require('../../src/Serializers/ChannelSerializer.js')
const FateChannelAddress = require('../../src/types/FateChannelAddress.js')

const s = new ChannelSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateChannelAddress("0xfedcba9876543210")),
        [159,5,136,254,220,186,152,118,84,50,16]
    )
});

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,5,136,254,220,186,152,118,84,50,16]),
        new FateChannelAddress("0xfedcba9876543210")
    )
});
