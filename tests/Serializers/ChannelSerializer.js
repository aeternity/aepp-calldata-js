import test from '../test.js'
import ChannelSerializer from '../../src/Serializers/ChannelSerializer.js'
import FateChannelAddress from '../../src/types/FateChannelAddress.js'

const s = new ChannelSerializer()

test('Serialize', t => {
    t.plan(1)
    t.deepEqual(
        s.serialize(new FateChannelAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")),
        [159,5,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,186,152,118,
            84,50,16,254,220,186,152,118,84,50,16]
    )
})

test('Deserialize', t => {
    t.plan(1)
    t.deepEqual(
        s.deserialize([159,5,160,254,220,186,152,118,84,50,16,254,220,186,152,118,84,50,16,254,220,
            186,152,118,84,50,16,254,220,186,152,118,84,50,16]),
        new FateChannelAddress("0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210")
    )
})
