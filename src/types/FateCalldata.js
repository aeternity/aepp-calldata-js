const FateData = require('./FateData')

class FateCalldata extends FateData {
    constructor(functionId, argTypes, argsData) {
        super('calldata')

        this._functionId = new Uint8Array(functionId)
        this._argTypes = argTypes
        this._args = argsData
    }

    get functionId() {
        return this._functionId
    }

    get argTypes() {
        return this._argTypes
    }

    get args() {
        return this._args
    }

    valueOf() {
        return {
            functionId: this._functionId,
            args: this._args
        }
    }

    accept(visitor) {
        return visitor.visitCalldata(this)
    }
}

module.exports = FateCalldata
