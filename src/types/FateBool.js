import FateData from './FateData.js'
import {FateTypeBool} from '../FateTypes.js'

class FateBool extends FateData {
    constructor(value) {
        super('bool')

        this._value = !!value
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeBool()
    }

    valueOf() {
        return this._value
    }
}

export default FateBool
