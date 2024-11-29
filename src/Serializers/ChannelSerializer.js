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
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateChannelAddress(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

export default ChannelSerializer
