import FateAddress from './FateAddress.js'
import { FateTypeContractAddress } from '../FateTypes.js'

class FateContractAddress extends FateAddress {
    constructor(value) {
        super(value, 'contract_pubkey', 'ct')
    }

    get type() {
        return FateTypeContractAddress()
    }
}

export default FateContractAddress
