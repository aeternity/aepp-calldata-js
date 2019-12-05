const fs = require('fs')
const blake = require('blakejs')
const HASH_BYTES = 32

// Definition of tag scheme.
// This has to follow the protocol specification.

const FATE_SMALL_INT    =        0b0 // sxxxxxx 0 - 6 bit integer with sign bit
//                                             1 Set below
const FATE_LONG_STRING  = 0b00000001 // 000000 01 | RLP encoded array - when size >= 64
const FATE_SHORT_STRING =       0b01 // xxxxxx 01 | [bytes] - when 0 < xxxxxx:size < 64
//                                            11  Set below
const FATE_SHORT_LIST   =     0b0011 // xxxx 0011 | [encoded elements] when  0 < length < 16
//                                     xxxx 0111
const FATE_TYPE_INTEGER = 0b00000111 // 0000 0111 - Integer typedef
const FATE_TYPE_BOOLEAN = 0b00010111 // 0001 0111 - Boolean typedef
const FATE_TYPE_LIST    = 0b00100111 // 0010 0111 | Type
const FATE_TYPE_TUPLE   = 0b00110111 // 0011 0111 | Size | [Element Types]
const FATE_TYPE_OBJECT  = 0b01000111 // 0100 0111 | ObjectType
const FATE_TYPE_BITS    = 0b01010111 // 0101 0111 - Bits typedef
const FATE_TYPE_MAP     = 0b01100111 // 0110 0111 | Type | Type
const FATE_TYPE_STRING  = 0b01110111 // 0111 0111 - string typedef
const FATE_TYPE_VARIANT = 0b10000111 // 1000 0111 | [Arities] | [Type]
const FATE_TYPE_BYTES   = 0b10010111 // 1001 0111 - Bytes typedef
                                // 1010 0111
                                // 1011 0111
                                // 1100 0111
                                // 1101 0111
const FATE_TYPE_VAR     = 0b11100111 // 1110 0111 | Id when 0 =< Id < 256 (type variable)
const FATE_TYPE_ANY     = 0b11110111 // 1111 0111 - Any typedef
const FATE_LONG_TUPLE   = 0b00001011 // 0000 1011 | RLP encoded (size - 16) | [encoded elements],
const FATE_SHORT_TUPLE  =     0b1011 // xxxx 1011 | [encoded elements] when 0  <  size < 16
//                                          1111 Set below
const FATE_LONG_LIST    = 0b00011111 // 0001 1111 | RLP encoded (length - 16) | [encoded lements]
const FATE_MAP          = 0b00101111 // 0010 1111 | RLP encoded size | [encoded key, encoded value]
const FATE_EMPTY_TUPLE  = 0b00111111 // 0011 1111
const FATE_POS_BITS     = 0b01001111 // 0100 1111 | RLP encoded integer (to be interpreted as bitfield)
const FATE_EMPTY_STRING = 0b01011111 // 0101 1111
const FATE_POS_BIG_INT  = 0b01101111 // 0110 1111 | RLP encoded (integer - 64)
const FATE_FALSE        = 0b01111111 // 0111 1111
//                              // 1000 1111 - FREE (Possibly for bytecode in the future.)
const FATE_OBJECT       = 0b10011111 // 1001 1111 | ObjectType | RLP encoded Array
const FATE_VARIANT      = 0b10101111 // 1010 1111 | [encoded arities] | encoded tag | [encoded values]
const FATE_MAP_ID       = 0b10111111 // 1011 1111 | RLP encoded integer (store map id)
const FATE_NEG_BITS     = 0b11001111 // 1100 1111 | RLP encoded integer (infinite 1:s bitfield)
const FATE_EMPTY_MAP    = 0b11011111 // 1101 1111
const FATE_NEG_BIG_INT  = 0b11101111 // 1110 1111 | RLP encoded (integer - 64)
const FATE_TRUE         = 0b11111111 // 1111 1111

const aci = JSON.parse(fs.readFileSync('build/identity.json', 'utf-8'))
const contractAci = aci[0].contract
// console.log(aci)
// console.log(contractAci)

function createCalldata(funName, args) {
    const funcAci = contractAci.functions.find(e => e.name == funName)
    const argAci = funcAci.arguments
    console.log(argAci)

    let serializedArgs = []
    for (let i = 0; i < argAci.length; i++) {
        const value = args[i]
        const type = argAci[i].type
        const serArg = serialize(type, value)
        serializedArgs = serializedArgs.concat(serArg)
        console.log("Serialize arg:", i, value, type, serArg, 
            serArg.map(a => a.toString(2).padStart(8, '0')))

    }

    const functionId = symbolIdentifier(funName)
    console.log("Function ID:", functionId)
    const argsTuple = serializeTuple(serializedArgs)
    console.log(Array.from(functionId).concat(argsTuple))
    const funcTuple = serializeTuple(Array.from(functionId).concat(argsTuple))
    console.log(argsTuple)
    console.log(funcTuple)
    // const calldata = serializeTuple(funcTuple)

    // return calldata
}

function symbolIdentifier(funName) {
    // First 4 bytes of 32 bytes blake hash
    hash = blake.blake2b(funName, null, HASH_BYTES)
    console.log("Blake2b 32 bytes hash", hash)

    return hash.slice(0, 4)
}

function serializeTuple(tuple) {
    if (tuple.length === 0) {
        return [FATE_EMPTY_TUPLE]
    }

    // should we serialize it ?! what about types ?!
    // const elements = tuple.map(e => serialize(x))
    const elements = tuple

    if (tuple.length < 16) {
        const prefix = (tuple.length << 4) | FATE_SHORT_TUPLE
        return [prefix].concat(elements)
    }

    return [
        FATE_LONG_TUPLE,
        tuple.size - 16,
        ...elements
    ]
}

function serialize(type, value) {
    switch(type) {
        case 'bool':
            // assert value === !!value
            return (value === true) ? [FATE_TRUE] : [FATE_FALSE]
            break;
        case 'int':
            return serializeInt(value)
            break;
        default:
            console.error("Unsupported type: " + type)
    }
}

function serializeInt(value) {

}

// console.log(symbolIdentifier("init"))
console.log(createCalldata("main", [true, false]))
