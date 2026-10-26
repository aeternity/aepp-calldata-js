import {asU8, rlpDecodeStream} from '../utils/stream.js'
import RLP from 'rlp'
import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import FateChannelAddress from '../types/FateChannelAddress.js'

class ChannelSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CHANNEL,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = asU8(data)
        const decoded = rlpDecodeStream(buffer.subarray(2))

        return [
            new FateChannelAddress(decoded.data),
            decoded.remainder
        ]
    }
}

export default ChannelSerializer
