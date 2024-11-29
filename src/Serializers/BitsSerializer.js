import FateTag from '../FateTag.js'
import * as RLPInt from '../utils/RLPInt.js'
import FateBits from '../types/FateBits.js'
import BaseSerializer from './BaseSerializer.js'
import abs from '../utils/abs.js'

class BitsSerializer extends BaseSerializer {
    serialize(data) {
        const prefix = data.value >= 0 ? FateTag.POS_BITS : FateTag.NEG_BITS

        return [
            prefix,
            ...RLPInt.encode(abs(data.value))
        ]
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const sign = buffer[0] === FateTag.POS_BITS ? 1n : -1n
        const [i, remainder] = RLPInt.decode(buffer.slice(1))

        return [
            new FateBits(i * sign),
            new Uint8Array(remainder)
        ]
    }
}

export default BitsSerializer
