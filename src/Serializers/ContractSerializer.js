import {asU8, rlpDecodeStream} from '../utils/stream.js'
import RLP from 'rlp'
import FateTag from '../FateTag.js'
import BaseSerializer from './BaseSerializer.js'
import FateContractAddress from '../types/FateContractAddress.js'

class ContractSerializer extends BaseSerializer {
    serialize(data) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_CONTRACT,
            ...RLP.encode(data.value)
        ]
    }

    deserializeStream(data) {
        const buffer = asU8(data)
        const decoded = rlpDecodeStream(buffer.subarray(2))

        return [
            new FateContractAddress(decoded.data),
            decoded.remainder
        ]
    }
}

export default ContractSerializer
