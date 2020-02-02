const FATE = require('./FATE_data.js')

module.exports = {
    serialize: function (data) {
        const [type, value] = data

        if (!this.serializers.hasOwnProperty(type)) {
            console.error("Unsupported type: ", type)
            return
        }

        return this.serializers[type].call(this, value)
    },
    serializers: {
        'bool': function (value) {
            return (value === true) ? [FATE.TRUE] : [FATE.FALSE]
        },
        'tuple': function (value) {
            if (value.length === 0) {
                return [FATE.EMPTY_TUPLE]
            }

            const elements = value.map(e => this.serialize(e))

            if (value.length < 16) {
                const prefix = (value.length << 4) | FATE.SHORT_TUPLE

                return [
                    prefix,
                    ...elements
                ]
            }

            return [
                FATE.LONG_TUPLE,
                value.size - 16,
                ...elements
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
        }
    }
}
