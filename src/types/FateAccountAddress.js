import FateAddress from './FateAddress.js'
import { FateTypeAccountAddress } from '../FateTypes.js'

class FateAccountAddress extends FateAddress {
    constructor(value) {
        super(value, 'account_pubkey', 'ak')
    }

    get type() {
        return FateTypeAccountAddress()
    }
}

export default FateAccountAddress
