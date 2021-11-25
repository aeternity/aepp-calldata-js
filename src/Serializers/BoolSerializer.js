const FateTag = require('../FateTag')
const FateBool = require('../types/FateBool')
const BaseSerializer = require('./BaseSerializer')
const FatePrefixError = require('../Errors/FatePrefixError')

class BoolSerializer {
    serialize(data) {
        return (data.valueOf() === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    }

    deserialize(data) {
        const [value, _rest] = this.deserializeStream(data)

        return value
    }

    deserializeStream(data) {
        const buffer = new Uint8Array(data)
        const prefix = buffer[0]
        const rest = buffer.slice(1)

        if (prefix === FateTag.TRUE) {
            return [new FateBool(true), rest]
        }

        if (prefix === FateTag.FALSE) {
            return [new FateBool(false), rest]
        }

        throw new FatePrefixError(prefix)
    }
}

module.exports = BoolSerializer
