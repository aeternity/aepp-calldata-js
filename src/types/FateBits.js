import { FateTypeBits } from '../FateTypes.js'
import FateData from './FateData.js'

class FateBits extends FateData {
    constructor(value) {
        super('bits')

        this._value = BigInt(value)
    }

    get type() {
        return FateTypeBits()
    }

    get value() {
        return this._value
    }

    valueOf() {
        return this._value
    }
}

export default FateBits
