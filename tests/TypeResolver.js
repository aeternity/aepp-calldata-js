const test = require('./test')
const TypeResolver = require('../src/TypeResolver')

const {
    FateTypeVoid,
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeHash,
    FateTypeSignature,
    FateTypeAccountAddress,
    FateTypeContractAddress,
    FateTypeOracleAddress,
    FateTypeOracleQueryAddress,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
    FateTypeChainGAMetaTx,
    FateTypeChainPayingForTx,
    FateTypeChainBaseTx,
    FateTypeAENSPointee,
    FateTypeAENSName,
    FateTypeSet,
    FateTypeBls12381Fr,
    FateTypeBls12381Fp,
} = require('../src/FateTypes')

const resolver = new TypeResolver()

test('Resolve void', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('void'),
        FateTypeVoid()
    )
})

test('Resolve unit', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('unit'),
        FateTypeTuple()
    )
})

test('Resolve bool', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('bool'),
        FateTypeBool()
    )
})

test('Resolve int', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('int'),
        FateTypeInt()
    )
})

test('Resolve string', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('string'),
        FateTypeString()
    )
})

test('Resolve bits', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('bits'),
        FateTypeBits()
    )
})

test('Resolve hash', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('hash'),
        FateTypeHash()
    )
})

test('Resolve signature', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('signature'),
        FateTypeSignature()
    )
})

test('Resolve account address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('address'),
        FateTypeAccountAddress()
    )
})

test('Resolve contract address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('contract_pubkey'),
        FateTypeContractAddress()
    )
})

test('Resolve oracle address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({oracle: ['int', 'string']}),
        FateTypeOracleAddress(FateTypeInt(), FateTypeString())
    )
})

test('Resolve oracle query address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({oracle_query: ['int', 'string']}),
        FateTypeOracleQueryAddress(FateTypeInt(), FateTypeString())
    )
})

test('Resolve bytes', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({bytes: 32}),
        FateTypeBytes(32)
    )
})

test('Resolve bytes any size', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({bytes: 'any'}),
        FateTypeBytes()
    )
})

test('Resolve list', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({list: ['int']}),
        FateTypeList(FateTypeInt())
    )
})

test('Resolve templated list', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({list: ["'a"]}, {"'a": "int"}),
        FateTypeList(FateTypeInt())
    )
})

test('Resolve map', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({map: ['int', 'bool']}),
        FateTypeMap(FateTypeInt(), FateTypeBool())
    )
})

test('Resolve templated map', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({map: ["'a", 'string']}, {"'a": 'int'}),
        FateTypeMap(FateTypeInt(), FateTypeString())
    )
})

test('Resolve tuple', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({tuple: ['int', 'bool']}),
        FateTypeTuple([FateTypeInt(), FateTypeBool()])
    )
})

test('Resolve unboxed singleton tuple', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({tuple: ['int']}),
        FateTypeInt()
    )
})

test('Resolve templated tuple', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({tuple: ["'a", "'b"]}, {"'a": 'int', "'b": 'bool'}),
        FateTypeTuple([FateTypeInt(), FateTypeBool()])
    )
})

test('Resolve record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({
            record: [
                {name: 'x', type: 'int'},
                {name: 'y', type: 'int'}
            ]
        }),
        FateTypeRecord(
            ['x', 'y'],
            [FateTypeInt(), FateTypeInt()]
        )
    )
})

test('Resolve unboxed singleton record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({record: [{name: 'x', type: 'int'}]}),
        FateTypeInt()
    )
})

test('Resolve nested record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({
            record: [
                {
                    name: 'origin',
                    type: {
                        record: [
                            {name: 'x', type: 'int'},
                            {name: 'y', type: 'int'}
                        ]
                    }
                },
                {name: 'a', type: 'int'},
                {name: 'b', type: 'int'},
            ]
        }),
        FateTypeRecord(
            ['origin', 'a', 'b'],
            [
                FateTypeRecord(['x', 'y'], [FateTypeInt(), FateTypeInt()]),
                FateTypeInt(),
                FateTypeInt()
            ],
        )
    )
})

test('Resolve variant', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({
            variant: [
                {Nope: []},
                {No: []},
                {Yep: ['int']},
                {Yes: []}
            ]
        }),
        FateTypeVariant([{Nope: []}, {No: []}, {Yep: [FateTypeInt()]}, {Yes: []}])
    )
})

test('Resolve variant with template vars', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(
            {
                variant: [
                    {Zero: []},
                    {Any: ["'a", "'b", 'int', 'int']},
                ]
            },
            {"'a": 'int', "'b": 'bool'}
        ),
        FateTypeVariant([
            {Zero: []},
            {Any: [FateTypeInt(), FateTypeBool(), FateTypeInt(), FateTypeInt()]}
        ])
    )
})

test('Resolve Option', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({option: ['int']}),
        FateTypeOption([FateTypeInt()])
    )
})

test('Resolve Chain.ttl', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Chain.ttl'),
        FateTypeChainTTL()
    )
})

test('Resolve Chain.ga_meta_tx', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Chain.ga_meta_tx'),
        FateTypeChainGAMetaTx()
    )
})

test('Resolve Chain.paying_for_tx', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Chain.paying_for_tx'),
        FateTypeChainPayingForTx()
    )
})

test('Resolve Chain.base_tx', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Chain.base_tx'),
        FateTypeChainBaseTx()
    )
})

test('Resolve AENS.pointee', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('AENS.pointee'),
        FateTypeAENSPointee()
    )
})

test('Resolve AENS.name', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('AENS.name'),
        FateTypeAENSName()
    )
})

test('Resolve Set.set', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({'Set.set': ['int']}),
        FateTypeSet(FateTypeInt())
    )
})

test('Resolve MCL_BLS12_381.fr', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('MCL_BLS12_381.fr'),
        FateTypeBls12381Fr()
    )
})

test('Resolve MCL_BLS12_381.fp', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('MCL_BLS12_381.fp'),
        FateTypeBls12381Fp()
    )
})

test('Throws on invalid type', t => {
    t.plan(1)
    t.throws(
        () => resolver.resolveType('very_wrong_type'),
        {
            name: 'TypeResolveError',
            message: `Cannot resolve type: "very_wrong_type"`
        }
    )
})
