import FateData from './FateData.js'
import {FateTypeInt} from '../FateTypes.js'

class FateInt extends FateData {
    constructor(value) {
        super('int')

        this._value = BigInt(value)
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeInt()
    }

    valueOf() {
        return this._value
    }
}

export default FateInt
