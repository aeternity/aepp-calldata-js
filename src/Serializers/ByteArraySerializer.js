const FateTag = require('../FateTag.js')
const IntSerializer = require('./IntSerializer.js')

const intSerializer = new IntSerializer()

ByteArraySerializer = function () {}

ByteArraySerializer.prototype = {
    serialize: function (data) {
        if (data.length === 0) {
            return [FateTag.EMPTY_STRING]
        }

        if (data.length < 64) {
            const prefix = (data.length << 2) | FateTag.SHORT_STRING

            return [
                prefix,
                ...data
            ]
        }

        return [
            FateTag.LONG_STRING,
            ...intSerializer.serialize((data.length - 64)),
            ...data
        ]
    }
}

module.exports = ByteArraySerializer
