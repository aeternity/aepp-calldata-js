const RLP = require('rlp')
const FATE = require('./FATE_data.js')

module.exports = {
    serialize: function (data) {
        const [type, value] = data

        if (!this.serializers.hasOwnProperty(type)) {
            throw new Error("Unsupported type: " + type);
        }

        return this.serializers[type].call(this, value)
    },
    encodeUnsigned: function (value) {
        if (value === 0) {
            return [0]
        }

        if (value < 256) {
            return [value]
        }

        return [
            ...this.encodeUnsigned(value >> 8),
            value & 0xff
        ]
    },
    rlpEncodeUnsigned: function (value) {
        const buffer = Uint8Array.from(this.encodeUnsigned(value))

        return [
            ...RLP.encode(buffer)
        ]
    },
    serializers: {
        'bool': function (value) {
            return (value === true) ? [FATE.TRUE] : [FATE.FALSE]
        },
        'int': function (value) {
            const absVal = Math.abs(value)

            // small integer
            if (absVal < 64) {
                if (value >= 0) {
                    return [(value << 1)]
                }

                // negative
                return [(0xff | (absVal << 1)) & 0b11111110]
            }

            // large negative integer
            if (value < 0) {
                return [
                    FATE.NEG_BIG_INT,
                    ...this.rlpEncodeUnsigned(absVal - 64)
                ]
            }

            // large positive integer
            return [
                FATE.POS_BIG_INT,
                ...this.rlpEncodeUnsigned(absVal - 64)
            ]

        },
        'tuple': function (value) {
            if (value.length === 0) {
                return [FATE.EMPTY_TUPLE]
            }

            const elements = value.map(e => this.serialize(e)).flat(Infinity)

            if (value.length < 16) {
                const prefix = (value.length << 4) | FATE.SHORT_TUPLE

                return [
                    prefix,
                    ...elements
                ]
            }

            return [
                FATE.LONG_TUPLE,
                ...this.serialize(['int', elements.length - 16]),
                ...elements
            ]
        },
        //TODO: nested lists
        'list': function (value) {
            const [type, elements] = value
            const serializedElements = elements.map(e => this.serialize([type, e])).flat(Infinity)
            const len = elements.length

            if (len < 16) {
                const prefix = (len << 4) | FATE.SHORT_LIST

                return [
                    prefix,
                    ...serializedElements
                ]
            }

            return [
                FATE.LONG_LIST,
                ...this.serialize(['int', len - 16]),
                ...serializedElements
            ]
        },
        //TODO: nested maps
        'map': function (value) {
            const [keyKype, valueType, elements] = value
            const len = elements.length

            const serializedElements = elements.map(e => {
                const [key, value] = e
                return [
                    this.serialize([keyKype, key]),
                    this.serialize([valueType, value])
                ]
            })

            return [
                FATE.MAP,
                ...this.rlpEncodeUnsigned(len),
                ...serializedElements.flat(Infinity)
            ]
        },
        'byte_array': function (byteArray) {
            if (byteArray.length === 0) {
                return [FATE.EMPTY_STRING]
            }

            if (byteArray.length < 64) {
                const prefix = (byteArray.length << 2) | FATE.SHORT_STRING

                return [
                    prefix,
                    ...byteArray
                ]
            }

            return [
                FATE.LONG_STRING,
                ...this.serialize(['int', (byteArray.length - 64)]),
                ...byteArray
            ]
        },
        'string': function (value) {
            const encoder = new TextEncoder()
            const bytes = encoder.encode(value)

            return this.serialize(['byte_array', bytes])
        },
        'bits': function (value) {
            const absVal = Math.abs(value)
            const prefix = value >= 0 ? FATE.POS_BITS : FATE.NEG_BITS

            return [
                prefix,
                ...this.rlpEncodeUnsigned(absVal)
            ]
        }
    }
}
