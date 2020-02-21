const FateTag = require('../FateTag.js')
const Int2ByteArray = require('../utils/Int2ByteArray.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')

const byteArraySerializer = new ByteArraySerializer()

BytesSerializer = function () {}

BytesSerializer.prototype = {
    serialize: function (bytes) {
        const byteArray = Int2ByteArray(bytes.value)
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_BYTES,
            ...byteArraySerializer.serialize(byteArray)
        ]
    }
}

module.exports = BytesSerializer
