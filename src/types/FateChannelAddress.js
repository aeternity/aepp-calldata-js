import FateAddress from './FateAddress.js'
import { FateTypeChannelAddress } from '../FateTypes.js'

class FateChannelAddress extends FateAddress {
    constructor(value) {
        super(value, 'channel', 'ch')
    }

    get type() {
        return FateTypeChannelAddress()
    }
}

export default FateChannelAddress
