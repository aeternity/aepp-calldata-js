import FateData from './FateData.js'
import {FateTypeVoid} from '../FateTypes.js'

class FateVoid extends FateData {
    constructor() {
        super('void')

        this._value = undefined
    }

    get value() {
        return this._value
    }

    get type() {
        return FateTypeVoid()
    }

    valueOf() {
        return this._value
    }
}

export default FateVoid
