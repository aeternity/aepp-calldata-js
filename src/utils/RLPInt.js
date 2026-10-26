import RLP from 'rlp'
import {rlpDecodeStream} from './stream.js'
import {int2ByteArray, byteArray2Int} from './int2ByteArray.js'

export function encode(value) {
    return new Uint8Array(RLP.encode(int2ByteArray(value)))
}

export function decode(buffer) {
    const decoded = rlpDecodeStream(buffer)
    return [byteArray2Int(decoded.data), decoded.remainder]
}
