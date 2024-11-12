import test from './test.js'
import AciTypeResolver from '../src/AciTypeResolver.js'
import aci from '../build/contracts/Test.json' with { type: 'json' }
import {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeContractAddress,
    FateTypeTuple,
    FateTypeRecord,
    FateTypeVariant,
} from '../src/FateTypes.js'

const CONTRACT = 'Test'
const resolver = new AciTypeResolver(aci)
const ns = (name) => `${CONTRACT}.${name}`

test('Get implicit empty init argument types', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getCallTypes(CONTRACT, 'init'),
        {types: [], required: 0}
    )
})

test('Get function argument types', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getCallTypes(CONTRACT, 'test_bool'),
        {
            types: [FateTypeBool(), FateTypeBool()],
            required: 2
        }
    )
})

test('Get function return type', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getReturnType(CONTRACT, 'test_bool'),
        FateTypeBool()
    )
})

test('Return type unit', t => {
    t.plan(1)
    t.deepEqual(
        resolver.getReturnType(CONTRACT, 'test_unit'),
        FateTypeTuple()
    )
})

test('Resolve contract address', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('RemoteTest'),
        FateTypeContractAddress()
    )
})

test('Resolve type defs', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('Test.number'),
        FateTypeInt()
    )
})

test('Resolve record', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(ns('point')),
        FateTypeRecord(
            ['x', 'y'],
            [FateTypeInt(), FateTypeInt()]
        )
    )
})

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
})

test('Resolve variant', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType(ns('really_t')),
        FateTypeVariant([{Nope: []}, {No: []}, {Yep: [FateTypeInt()]}, {Yes: []}])
    )
})

test('Resolve variant with template vars', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({
            [ns('amount_t')]: ['int', 'bool']
        }),
        FateTypeVariant([
            {Zero: []},
            {Any: [FateTypeInt(), FateTypeBool(), FateTypeInt(), FateTypeInt()]}
        ])
    )
})

test('Resolve template type', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType({[ns('box')]: ['int']}),
        FateTypeInt()
    )
})

test('Resolve state', t => {
    t.plan(1)
    t.deepEqual(
        resolver.resolveType('WithInit.state'),
        FateTypeRecord(['v', 'z'], [FateTypeString(), FateTypeString()])
    )
})
