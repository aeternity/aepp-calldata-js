import FateAddress from './FateAddress.js'
import { FateTypeOracleQueryAddress } from '../FateTypes.js'

class FateOracleQueryAddress extends FateAddress {
    constructor(value) {
        super(value, 'oracle_query_id', 'oq')
    }

    get type() {
        return FateTypeOracleQueryAddress()
    }
}

export default FateOracleQueryAddress
