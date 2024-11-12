import FateInt from '../types/FateInt.js'
import FateBool from '../types/FateBool.js'
import FateString from '../types/FateString.js'
import FateHash from '../types/FateHash.js'
import FateSignature from '../types/FateSignature.js'
import FateBytes from '../types/FateBytes.js'
import FateBits from '../types/FateBits.js'
import FateAccountAddress from '../types/FateAccountAddress.js'
import FateContractAddress from '../types/FateContractAddress.js'
import FateChannelAddress from '../types/FateChannelAddress.js'
import FateOracleAddress from '../types/FateOracleAddress.js'
import FateOracleQueryAddress from '../types/FateOracleQueryAddress.js'
import BaseDataFactory from './BaseDataFactory.js'

const TYPES = [
    'int',
    'bool',
    'string',
    'bits',
    'hash',
    'bytes',
    'signature',
    'account_pubkey',
    'contract_pubkey',
    'channel',
    'oracle_pubkey',
    'oracle_query_id'
]

class PrimitiveDataFactory extends BaseDataFactory {
    supports({ name, _valueTypes }) {
        return TYPES.includes(name)
    }

    create(type, value) {
        switch (type.name) {
        case 'int':
            return new FateInt(value)
        case 'bool':
            return new FateBool(value)
        case 'string':
            return new FateString(value)
        case 'bits':
            return new FateBits(value)
        case 'hash':
            return new FateHash(value)
        case 'bytes':
            return new FateBytes(value, type.valueTypes)
        case 'signature':
            return new FateSignature(value)
        case 'account_pubkey':
            return new FateAccountAddress(value)
        case 'contract_pubkey':
            return new FateContractAddress(value)
        case 'channel':
            return new FateChannelAddress(value)
        case 'oracle_pubkey':
            return new FateOracleAddress(value)
        case 'oracle_query_id':
            return new FateOracleQueryAddress(value)
        default:
            throw new Error(`Unsupported type "${type.name}"`)
        }
    }
}

export default PrimitiveDataFactory
