const RLP = require('rlp')
const BaseSerializer = require('./BaseSerializer')
const TypeSerializer = require('./TypeSerializer')
const {ByteArray2Hex} = require('../utils/Int2ByteArray')
const {
    FateTypeByteArray,
    FateTypeString,
    FateTypeMap,
} = require('../FateTypes')

class BytecodeSerializer extends BaseSerializer {
    constructor(globalSerializer) {
        super(globalSerializer)

        this._typeSerializer = new TypeSerializer()
    }

    deserialize(data) {
        const codeBin = RLP.decode(data, true)
        const symbolsBin = RLP.decode(codeBin.remainder, true)
        const annotationsBin = RLP.decode(symbolsBin.remainder)

        const functions = this.deserializeFunctions(codeBin.data)
        const symbols = this.deserializeSymbols(symbolsBin.data)
        const annotations = this.deserializeAnnotations(annotationsBin)

        return {functions, symbols, annotations}
    }

    deserializeFunctions(data) {
        let fun = {}
        let rest = data
        const functions = []

        while (rest.length) {
            [fun, rest] = this.deserializeFunction(rest)
            functions.push(fun)
        }

        return functions
    }

    deserializeFunction(data) {
        const prefix = data[0]
        const id = ByteArray2Hex(data.slice(1, 5))

        if (prefix !== 0xfe) {
            throw new Error(`Wrong function prefix, expeted 0xfe got ${data[0].toString(16)}`)
        }

        const [attributes, rest2] = this.deserializeAttributes(data.slice(5))
        const [args, returnType, rest3] = this.deserializeSigniture(rest2)
        const [instructions, rest4] = this.deserializeInstructions(rest3)

        return [
            {
                id,
                attributes,
                args,
                returnType,
                instructions
            },
            rest4
        ]
    }

    deserializeInstructions(data) {
        const i = data.findIndex((v) => v === 0xfe)

        if (-1 === i) {
            return [[], new Uint8Array()]
        }

        return [[], data.slice(i)]
    }

    deserializeSigniture(data) {
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
            const hex = ByteArray2Hex(key)
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
