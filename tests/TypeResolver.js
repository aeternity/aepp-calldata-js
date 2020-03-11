const fs = require('fs')
const test = require('ava');
const TypeResolver = require('../src/TypeResolver.js')
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
    FateTypeVariant,
    FateTypeOption,
    FateTypeChainTTL,
} = require('../src/FateTypes.js')

const CONTRACT = 'Test'
const ns = (name) => CONTRACT + '.' + name

test.before(async t => {
    const aci = JSON.parse(fs.readFileSync('build/contracts/Test.json', 'utf-8'))
    const resolver = new TypeResolver(aci)

    t.context.resolver = resolver
});


test('Get implicit empty init argument types', t => {
    t.deepEqual(
        t.context.resolver.getArgumentTypes(CONTRACT, 'init'),
        []
    )
});

test('Get function argument types', t => {
    t.deepEqual(
        t.context.resolver.getArgumentTypes(CONTRACT, 'test_bool'),
        [FateTypeBool(), FateTypeBool()]
    )
});

test('Get function return type', t => {
    t.deepEqual(
        t.context.resolver.getReturnType(CONTRACT, 'test_bool'),
        FateTypeBool()
    )
});

test('Resolve bool', t => {
    t.deepEqual(
        t.context.resolver.resolveType('bool'),
        FateTypeBool()
    )
});

test('Resolve int', t => {
    t.deepEqual(
        t.context.resolver.resolveType('int'),
        FateTypeInt()
    )
});

test('Resolve string', t => {
    t.deepEqual(
        t.context.resolver.resolveType('string'),
        FateTypeString()
    )
});

test('Resolve bits', t => {
    t.deepEqual(
        t.context.resolver.resolveType('bits'),
        FateTypeBits()
    )
});

test('Resolve hash', t => {
    t.deepEqual(
        t.context.resolver.resolveType('hash'),
        FateTypeHash()
    )
});

test('Resolve signature', t => {
    t.deepEqual(
        t.context.resolver.resolveType('signature'),
        FateTypeSignature()
    )
});

test('Resolve account address', t => {
    t.deepEqual(
        t.context.resolver.resolveType('address'),
        FateTypeAccountAddress()
    )
});

test('Resolve contract address', t => {
    t.deepEqual(
        t.context.resolver.resolveType('RemoteTest'),
        FateTypeContractAddress()
    )
});

test('Resolve oracle address', t => {
    t.deepEqual(
        t.context.resolver.resolveType({oracle: ['int', 'string']}),
        FateTypeOracleAddress(FateTypeInt(), FateTypeString())
    )
});

test('Resolve oracle query address', t => {
    t.deepEqual(
        t.context.resolver.resolveType({oracle_query: ['int', 'string']}),
        FateTypeOracleQueryAddress(FateTypeInt(), FateTypeString())
    )
});

test('Resolve bytes', t => {
    t.deepEqual(
        t.context.resolver.resolveType({bytes: 32}),
        FateTypeBytes(32)
    )
});

test('Resolve type defs', t => {
    t.deepEqual(
        t.context.resolver.resolveType('Test.number'),
        FateTypeInt()
    )
});

test('Resolve list', t => {
    t.deepEqual(
        t.context.resolver.resolveType({list: ['int']}),
        FateTypeList(FateTypeInt())
    )
});

test('Resolve map', t => {
    t.deepEqual(
        t.context.resolver.resolveType({map: ['int', 'bool']}),
        FateTypeMap(FateTypeInt(), FateTypeBool())
    )
});

test('Resolve tuple', t => {
    t.deepEqual(
        t.context.resolver.resolveType({tuple: ['int', 'bool']}),
        FateTypeTuple([FateTypeInt(), FateTypeBool()])
    )
});

test('Resolve record', t => {
    t.deepEqual(
        t.context.resolver.resolveType(ns('point')),
        FateTypeTuple([
            FateTypeInt(),
            FateTypeInt(),
        ])
    )
});

test('Resolve nested record', t => {
    t.deepEqual(
        t.context.resolver.resolveType(ns('rectangle')),
        FateTypeTuple([
            FateTypeTuple([FateTypeInt(), FateTypeInt()]),
            FateTypeInt(),
            FateTypeInt(),
        ])
    )
});

test('Resolve variant', t => {
    t.deepEqual(
        t.context.resolver.resolveType(ns('really_t')),
        FateTypeVariant(
            0,
            null,
            [{Nope: []}, {No: []}, {Yep: [FateTypeInt()]}, {Yes: []}]
        )
    )
});

test('Resolve Option', t => {
    t.deepEqual(
        t.context.resolver.resolveType({option: ['int']}),
        FateTypeOption(FateTypeInt())
    )
});

test('Resolve Chain.ttl', t => {
    t.deepEqual(
        t.context.resolver.resolveType('Chain.ttl'),
        FateTypeChainTTL()
    )
});

test('Resolve template type', t => {
    t.deepEqual(
        t.context.resolver.resolveType({[ns('box')]: ['int']}),
        FateTypeInt()
    )
});
