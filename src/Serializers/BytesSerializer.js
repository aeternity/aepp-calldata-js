const FateTag = require('../FateTag.js')
const Int2ByteArray = require('../utils/Int2ByteArray.js')
const ByteArraySerializer = require('./ByteArraySerializer.js')

const byteArraySerializer = new ByteArraySerializer()

BytesSerializer = function () {}

BytesSerializer.prototype = {
    serialize: function (bytes) {
        return [
            FateTag.OBJECT,
            FateTag.OTYPE_BYTES,
            ...byteArraySerializer.serialize(bytes.valueOf())
        ]
    }
}

module.exports = BytesSerializer
