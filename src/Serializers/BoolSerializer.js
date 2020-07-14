const FateTag = require('../FateTag.js')
const FateBool = require('../types/FateBool.js')

class BoolSerializer {
    serialize(data) {
        return (data.valueOf() === true) ? [FateTag.TRUE] : [FateTag.FALSE]
    }
    deserialize(data) {
        const [value, rest] = this.deserializeStream(data)

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

        throw new Error("Invalid prefix: " + prefix.toString(2))
    }
}

module.exports = BoolSerializer
