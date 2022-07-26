const blake = require('blakejs/blake2b')

const HASH_BYTES = 32

const hash = (name) => {
    return Array.from(blake.blake2b(name, null, HASH_BYTES))
}

const symbolIdentifier = (funName) => {
    // First 4 bytes of 32 bytes blake hash
    return hash(funName).slice(0, 4)
}

module.exports = {
    hash,
    symbolIdentifier
}
