const FATE = require('../fate.js')
const Int2ByteArray = require('../utils/Int2ByteArray.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')

const byteArraySerializer = new ByteArraySerializer()

BytesSerializer = function () {}

BytesSerializer.prototype = {
    serialize: function (value) {
        return [
            FATE.OBJECT,
            FATE.OTYPE_BYTES,
            ...byteArraySerializer.serialize(Int2ByteArray(value))
        ]
    }
}

module.exports = BytesSerializer
