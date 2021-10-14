const test = require('../test.js')
const ChannelSerializer = require('../../src/Serializers/ChannelSerializer.js')
const FateChannelAddress = require('../../src/types/FateChannelAddress.js')

const s = new ChannelSerializer()

test('Serialize', t => {
    t.plan(2)
    t.deepEqual(
        s.serialize(new FateChannelAddress("0xfedcba9876543210")),
        [159,5,136,254,220,186,152,118,84,50,16]
    )

    t.deepEqual(
        s.serialize(new FateChannelAddress("ch_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt")),
        [159,5,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]
    )
});

test('Deserialize', t => {
    t.plan(2)
    t.deepEqual(
        s.deserialize([159,5,136,254,220,186,152,118,84,50,16]),
        new FateChannelAddress("0xfedcba9876543210")
    )

    t.is(
        s.deserialize([159,5,160,222,104,191,225,178,3,229,31,82,53,27,160,135,247,155,120,40,230,161,64,240,195,20,166,112,199,0,59,63,245,112,117]).valueOf(),
        "ch_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt"
    )
});
