import RLP from 'rlp'
import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import FateAccountAddress from '../types/FateAccountAddress.js'

class AddressSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_ADDRESS,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const decoded = RLP.decode(buffer.slice(2), true)

        return [
            new FateAccountAddress(decoded.data),
            new Uint8Array(decoded.remainder)
        ]
    }
}

export default AddressSerializer
