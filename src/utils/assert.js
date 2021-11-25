const InternalError = require('../Errors/InternalError')

const assert = (condition, message) => {
    if (!condition) {
        throw new InternalError(message)
    }
}

module.exports = assert
