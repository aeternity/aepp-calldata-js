const hexStringToByteArray = require('./utils/hexStringToByteArray')
const {int2ByteArray, byteArray2Int, byteArray2Hex} = require('./utils/int2ByteArray')

// this is overlaping with general calldata Serializer with some extras: uint_* and id
class PrimitivesEncoder {
    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()

        this.decoders = {
            int: this.decodeInt,
            uint_16: this.decodeInt,
            uint_32: this.decodeInt,
            uint_64: this.decodeInt,
            bool: this.decodeBool,
            string: this.decodeString.bind(this),
            binary: this.decodeBinary,
            hex: (value) => byteArray2Hex(value),
        }

        this.encoders = {
            int: this.encodeInt,
            uint_16: (value) => this.encodeTypedInt('uint_16', value),
            uint_32: (value) => this.encodeTypedInt('uint_32', value),
            uint_64: (value) => this.encodeTypedInt('uint_64', value),
            bool: this.encodeBool,
            string: this.encodeString.bind(this),
            binary: this.encodeBinary,
            hex: (value) => hexStringToByteArray(value),
        }
    }

    supports(type) {
        return this.decoders.hasOwnProperty(type)
    }

    encode(type, value) {
        if (!this.encoders.hasOwnProperty(type)) {
            throw new Error('Unsupported encoder type: ' + type)
        }

        const encoder = this.encoders[type]

        return (Array.isArray(value)) ? value.map(v => encoder(v)) : encoder(value)
    }

    decode(type, value) {
        if (!this.decoders.hasOwnProperty(type)) {
            throw new Error('Unsupported decode type: ' + type)
        }

        const decoder = this.decoders[type]

        return (Array.isArray(value)) ? value.map(v => decoder(v)) : decoder(value)
    }

    encodeInt(value) {
        return int2ByteArray(value)
    }

    encodeTypedInt(type, value) {
        let dataView

        switch (type) {
        case 'uint_16':
            dataView = new DataView(new ArrayBuffer(2))
            dataView.setUint16(0, Number(value))
            break
        case 'uint_32':
            dataView = new DataView(new ArrayBuffer(4))
            dataView.setUint32(0, Number(value))
            break
        case 'uint_64':
            dataView = new DataView(new ArrayBuffer(8))
            dataView.setBigUint64(0, value)
            break
        default:
            throw new Error('Unsupported int type')
        }

        return new Uint8Array(dataView.buffer)
    }

    decodeInt(value) {
        return byteArray2Int(value)
    }

    encodeBool(value) {
        return new Uint8Array((value === true) ? [0x01] : [0x00])
    }

    decodeBool(buffer) {
        if (!(buffer instanceof Uint8Array)) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        if (buffer[0] === 0x00) {
            return false
        }

        if (buffer[0] === 0x01) {
            return true
        }

        throw new Error('Invalid bool value')
    }

    encodeString(value) {
        return this.textEnoder.encode(value)
    }

    decodeString(buffer) {
        if (!(buffer instanceof Uint8Array)) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        return this.textDecoder.decode(buffer)
    }

    encodeBinary(value) {
        if (typeof value === 'string' || value instanceof String) {
            const encoder = new TextEncoder()

            return encoder.encode(value)
        }

        if (!(value instanceof Uint8Array)) {
            throw new Error('Invalid value type, expected Uint8Array')
        }

        return value
    }

    decodeBinary(buffer) {
        if (!(buffer instanceof Uint8Array)) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        return buffer
    }
}

module.exports = PrimitivesEncoder
