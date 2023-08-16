const RLP = require('rlp')
const BaseSerializer = require('./BaseSerializer')
const TypeSerializer = require('./TypeSerializer')
const {byteArray2Hex, byteArray2Int} = require('../utils/int2ByteArray')
const OPCODES = require('../FateOpcodes')
const {
    FateTypeByteArray,
    FateTypeString,
    FateTypeMap,
} = require('../FateTypes')

const MODIFIERS = {
    0b11: 'immediate',
    0b10: 'var',
    0b01: 'arg',
    0b00: 'stack'
}

const splitArgs = (data, n = 1) => {
    const args = []
    let bits = Number(byteArray2Int(data))

    for (let i = 0; i < n * 2; i += 2) {
        args.push(bits & 0b11)
        bits >>= 2
    }

    if (bits !== 0) {
        throw new Error(`Invalid argument modifier data. Unexpected padding: 0b${bits.toString(2)}`)
    }

    return args
}

class BytecodeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super(globalSerializer)

        this._typeSerializer = new TypeSerializer()
    }

    deserialize(data) {
        const codeBin = RLP.decode(data, true)
        const symbolsBin = RLP.decode(codeBin.remainder, true)
        const annotationsBin = RLP.decode(symbolsBin.remainder)

        const symbols = this.deserializeSymbols(symbolsBin.data)
        const functions = this.deserializeFunctions(codeBin.data, symbols)
        const annotations = this.deserializeAnnotations(annotationsBin)

        return {functions, symbols, annotations}
    }

    deserializeFunctions(data, symbols) {
        let fun = {}
        let rest = data
        const functions = []

        while (rest.length) {
            [fun, rest] = this.deserializeFunction(rest, symbols)
            functions.push(fun)
        }

        return functions
    }

    deserializeFunction(data, symbols) {
        const prefix = data[0]
        const id = byteArray2Hex(data.slice(1, 5))

        if (prefix !== 0xfe) {
            throw new Error(`Wrong function prefix, expeted 0xfe got 0x${data[0].toString(16)}`)
        }

        const name = symbols[id]
        const [attributes, rest2] = this.deserializeAttributes(data.slice(5))
        const [args, returnType, rest3] = this.deserializeSignature(rest2)
        const [instructions, rest4] = this.deserializeInstructions(rest3)

        return [
            {
                id,
                name,
                attributes,
                args,
                returnType,
                instructions
            },
            rest4
        ]
    }

    deserializeInstructions(data) {
        let instruction = {}
        let rest = data
        const instructions = []

        let block = 0
        let end = false

        while (rest.length && rest[0] !== 0xfe) {
            if (instructions[block] === undefined) {
                instructions[block] = []
            }

            [instruction, rest, end] = this.deserializeInstruction(rest)
            instructions[block].push(instruction)

            if (end) {
                block++
            }
        }

        return [instructions, rest]
    }

    deserializeInstruction(data) {
        const opcode = data[0]
        const rest = data.slice(1)

        if (!OPCODES.hasOwnProperty(opcode)) {
            throw new Error(`Unsupported opcode: 0x${opcode.toString(16)}`)
        }

        const instr = OPCODES[opcode]
        const {mnemonic, end} = instr

        if (instr.args === 0) {
            return [{mnemonic, args: []}, rest, end]
        }

        const [args, rest2] = this.deserializeArguments(rest, instr.args)

        return [{mnemonic, args}, rest2, end]
    }

    deserializeArguments(data, n) {
        const numBytes = (n <= 4) ? 1 : 2
        const modBytes = data.subarray(0, numBytes)
        const rest = data.slice(numBytes)

        const modifiers = splitArgs(modBytes, n)
        const args = []
        let rest2 = rest
        let arg

        modifiers.forEach(mod => {
            [arg, rest2] = this.deserializeArgument(mod, rest2)
            args.push(arg)
        })

        return [args, rest2]
    }

    deserializeArgument(bits, stream) {
        const mod = MODIFIERS[bits]

        if (mod === 'stack') {
            return [{mod, arg: 0}, stream]
        }

        const [arg, rest] = this.globalSerializer.deserializeStream(stream)

        return [{mod, arg: arg.valueOf()}, rest]
    }

    deserializeSignature(data) {
        const [args, rest] = this._typeSerializer.deserializeStream(data)
        const [returnType, rest2] = this._typeSerializer.deserializeStream(rest)

        return [args, returnType, rest2]
    }

    deserializeAttributes(data) {
        const [attributesInt, rest] = this.globalSerializer.deserializeStream(data)
        const attributesByte = Number(attributesInt.valueOf())
        const attributes = []

        if (attributesByte & 0b0001) {
            attributes.push('private')
        }

        if (attributesByte & 0b0010) {
            attributes.push('payable')
        }

        return [attributes, rest]
    }

    deserializeSymbols(data) {
        // Needs typehint with ByteArray otherwise deserializes to string
        const type = FateTypeMap(FateTypeByteArray(), FateTypeString())
        const symbols = this.globalSerializer.deserializeWithType(data, type).valueOf()
        const symbolsMap = {}

        symbols.forEach((val, key) => {
            const hex = byteArray2Hex(key)
            symbolsMap[hex] = val
        })

        return symbolsMap
    }

    deserializeAnnotations(data) {
        const annotations = this.globalSerializer.deserialize(data).valueOf()

        return annotations
    }
}

module.exports = BytecodeSerializer
