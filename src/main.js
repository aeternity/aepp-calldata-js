import Encoder from './api/Encoder.js'
import AciContractCallEncoder from './api/AciContractCallEncoder.js'
import BytecodeContractCallEncoder from './api/BytecodeContractCallEncoder.js'
import ContractByteArrayEncoder from './api/ContractByteArrayEncoder.js'
import FateApiEncoder from './api/FateApiEncoder.js'
import ContractEncoder from './api/ContractEncoder.js'
import TypeResolver from './api/TypeResolver.js'

export {
    Encoder,
    AciContractCallEncoder,
    BytecodeContractCallEncoder,
    ContractByteArrayEncoder,
    FateApiEncoder,
    ContractEncoder,
    TypeResolver,
}

/**
 * @deprecated use named exports instead
 */
export default {
    Encoder,
    AciContractCallEncoder,
    BytecodeContractCallEncoder,
    ContractByteArrayEncoder,
    FateApiEncoder,
    ContractEncoder,
    TypeResolver,
}
