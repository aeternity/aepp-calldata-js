const InternalError = require('../Errors/InternalError')

class FateData {
    constructor(name) {
        this.name = name
    }

    valueOf() {
        throw new InternalError('Not implemented.')
    }

    accept(visitor) {
        return visitor.visitData(this)
    }
}

module.exports = FateData
