const fs = require('fs')
const blake = require('blakejs')
const Serializer = require('./Serializer.js')
var base64check = require('base64check')

const HASH_BYTES = 32



const aci = JSON.parse(fs.readFileSync('build/identity.json', 'utf-8'))
const contractAci = aci[0].contract
const serializer = Object.create(Serializer)


// console.log(aci)
// console.log(contractAci)

function createCalldata(funName, args) {
    const funcAci = contractAci.functions.find(e => e.name == funName)
    const argAci = (funcAci) ? funcAci.arguments : []
    // console.log(argAci)

    let serializedArgs = []
    for (let i = 0; i < argAci.length; i++) {
        const value = args[i]
        const type = argAci[i].type
        const serArg = serializer.serialize(type, value)
        serializedArgs.push(serArg)
        // console.log("Serialize arg:", i, value, type, serArg, 
        //     serArg.map(a => a.toString(2).padStart(8, '0')))

    }

    // console.log(serializedArgs)
    // if (serializedArgs.length === 0) {
    //     const argsTuple = (serializedArgs.length === 0) ? serializeTuple([]) : serializeTuple(serializedArgs)
    // }

    const functionId = symbolIdentifier(funName)
    // console.log("Function ID:", functionId, serializeByteArray(functionId))

    const argsTuple = serializer.serialize('tuple', serializedArgs)
    // console.log("args typle:", argsTuple)
    // console.log(Array.from(functionId).concat(argsTuple))

    const funcTuple = serializer.serialize('tuple', [
            serializer.serialize('byte_array', functionId),
            argsTuple
    ])

    // console.log("function tuple", funcTuple)

    return new Uint8Array(funcTuple.flat(Infinity))
    // const calldata = serializeTuple(funcTuple)

    // return calldata
}

function symbolIdentifier(funName) {
    // First 4 bytes of 32 bytes blake hash
    hash = Array.from(blake.blake2b(funName, null, 32))
    // console.log("Blake2b 32 bytes hash", hash)

    return hash.slice(0, 4)
}

function encodeContractByteArray(byteArray) {
    return 'cb_' + base64check.encode(byteArray)
}

console.log(
    "calldata init()",
    encodeContractByteArray(createCalldata("init", []))
)

console.log(
    "calldata main(true, false)",
    encodeContractByteArray(createCalldata("main", [true, false]))
)

console.log(
    "calldata main(false, true)",
    encodeContractByteArray(createCalldata("main", [false, true]))
)

console.log(
    "calldata main2(42)",
    encodeContractByteArray(createCalldata("main", [42]))
)
