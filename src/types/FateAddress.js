const FateAddressRaw = require('./FateAddressRaw')
const bs58check = require('bs58check')
const FateTypeError = require('../Errors/FateTypeError')

class FateAddress extends FateAddressRaw {
    constructor(value, name, prefix) {
        const asString = value.toString()
        if (!asString.startsWith(prefix + '_')) {
            throw new FateTypeError(
                name,
                `Address should start with ${prefix}_, got ${asString} instead`
            )
        }

        const asBytes = bs58check.decode(asString.substring(prefix.length + 1))

        super(asBytes, name, prefix)
    }
}

module.exports = FateAddress
