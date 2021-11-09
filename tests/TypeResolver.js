const test = require('./test.js');
const TypeResolver = require('../src/TypeResolver.js')
const aci = require('../build/contracts/Test.json')
const {
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
    FateTypeAENSPointee,
    FateTypeChainGAMetaTx,
} = require('../src/FateTypes.js')

const CONTRACT = 'Test'
const resolver = new TypeResolver(aci)
const ns = (name) => CONTRACT + '.' + name

test('Get implicit empty init argument types', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getCallTypes(CONTRACT, 'init'),
        []
    )
});

test('Get function argument types', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getCallTypes(CONTRACT, 'test_bool'),
        [FateTypeBool(), FateTypeBool()]
    )
});

test('Get function return type', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getReturnType(CONTRACT, 'test_bool'),
        FateTypeBool()
    )
});

test('Resolve bool', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('bool'),
        FateTypeBool()
    )
});

test('Resolve int', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('int'),
        FateTypeInt()
    )
});

test('Resolve string', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('string'),
        FateTypeString()
    )
});

test('Resolve bits', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('bits'),
        FateTypeBits()
    )
});

test('Resolve hash', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('hash'),
        FateTypeHash()
    )
});

test('Resolve signature', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('signature'),
        FateTypeSignature()
    )
});

test('Resolve account address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('address'),
        FateTypeAccountAddress()
    )
});

test('Resolve contract address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('RemoteTest'),
        FateTypeContractAddress()
    )
});

test('Resolve oracle address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({oracle: ['int', 'string']}),
        FateTypeOracleAddress(FateTypeInt(), FateTypeString())
    )
});

test('Resolve oracle query address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({oracle_query: ['int', 'string']}),
        FateTypeOracleQueryAddress(FateTypeInt(), FateTypeString())
    )
});

test('Resolve bytes', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({bytes: 32}),
        FateTypeBytes(32)
    )
});

test('Resolve type defs', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Test.number'),
        FateTypeInt()
    )
});

test('Resolve list', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({list: ['int']}),
        FateTypeList(FateTypeInt())
    )
});

test('Resolve map', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({map: ['int', 'bool']}),
        FateTypeMap(FateTypeInt(), FateTypeBool())
    )
});

test('Resolve tuple', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({tuple: ['int', 'bool']}),
        FateTypeTuple([FateTypeInt(), FateTypeBool()])
    )
});

test('Resolve record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(ns('point')),
        FateTypeRecord(
            ['x', 'y'],
            [FateTypeInt(), FateTypeInt()]
        )
    )
});

test('Resolve nested record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(ns('rectangle')),
        FateTypeRecord(
            ['origin', 'a', 'b'],
            [
                FateTypeRecord(['x', 'y'], [FateTypeInt(), FateTypeInt()]),
                FateTypeInt(),
                FateTypeInt()
            ],
        )
    )
});

test('Resolve variant', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(ns('really_t')),
        FateTypeVariant(
            0,
            null,
            [{Nope: []}, {No: []}, {Yep: [FateTypeInt()]}, {Yes: []}]
        )
    )
});

test('Resolve variant with template vars', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({
            [ns('amount_t')]: ['int', 'bool']
        }),
        FateTypeVariant(
            0,
            null,
            [{Zero: []}, {Any: [FateTypeInt(), FateTypeBool(), FateTypeInt(), FateTypeInt()]}]
        )
    )
});

test('Resolve Option', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({option: ['int']}),
        FateTypeOption([FateTypeInt()])
    )
});

test('Resolve Chain.ttl', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Chain.ttl'),
        FateTypeChainTTL()
    )
});

test('Resolve AENS.pointee', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('AENS.pointee'),
        FateTypeAENSPointee()
    )
});

test('Resolve template type', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({[ns('box')]: ['int']}),
        FateTypeInt()
    )
});

test('Resolve state', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('WithInit.state'),
        FateTypeRecord(['v'], [FateTypeString()])
    )
});
