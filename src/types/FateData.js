import InternalError from '../Errors/InternalError.js'

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

export default FateData
