import FateAddress from './FateAddress.js'
import { FateTypeOracleAddress } from '../FateTypes.js'

class FateOracleAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_pubkey', 'ok')
    }

    get type() {
        return FateTypeOracleAddress()
    }
}

export default FateOracleAddress
