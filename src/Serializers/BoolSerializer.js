import {asU8} from '../utils/stream.js'
import FateTag from '../FateTag.js'
import FateBool from '../types/FateBool.js'
import BaseSerializer from './BaseSerializer.js'
import FatePrefixError from '../Errors/FatePrefixError.js'

class BoolSerializer extends BaseSerializer {
    serialize(data) {
        return (data.valueOf() === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    }

    deserializeStream(data) {
        const buffer = asU8(data)
        const prefix = buffer[0]
        const rest = buffer.subarray(1)

        if (prefix === FateTag.TRUE) {
            return [new FateBool(true), rest]
        }

        if (prefix === FateTag.FALSE) {
            return [new FateBool(false), rest]
        }

        throw new FatePrefixError(prefix)
    }
}

export default BoolSerializer
