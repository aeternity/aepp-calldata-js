const FATE = require('../fate.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')

const byteArraySerializer = new ByteArraySerializer()

StringSerializer = function () {}

StringSerializer.prototype = {
    serialize: function (value) {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(value)

        return byteArraySerializer.serialize(bytes)
    }
}

module.exports = StringSerializer
