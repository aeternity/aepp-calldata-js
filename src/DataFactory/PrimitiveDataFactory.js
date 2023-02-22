const FateInt = require('../types/FateInt')
const FateBool = require('../types/FateBool')
const FateString = require('../types/FateString')
const FateHash = require('../types/FateHash')
const FateSignature = require('../types/FateSignature')
const FateBytes = require('../types/FateBytes')
const FateBits = require('../types/FateBits')
const FateAccountAddress = require('../types/FateAccountAddress')
const FateContractAddress = require('../types/FateContractAddress')
const FateChannelAddress = require('../types/FateChannelAddress')
const FateOracleAddress = require('../types/FateOracleAddress')
const FateOracleQueryAddress = require('../types/FateOracleQueryAddress')
const BaseDataFactory = require('./BaseDataFactory')

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

module.exports = PrimitiveDataFactory
