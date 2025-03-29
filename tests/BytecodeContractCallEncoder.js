import fs from 'fs'
import test from './test.js'
import BytecodeContractCallEncoder from '../src/BytecodeContractCallEncoder.js'

const bytecode = fs.readFileSync('./build/contracts/Test.aeb')
const encoder = new BytecodeContractCallEncoder(bytecode.toString())

test('Encode implicit init', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('init', [])
    t.is(encoded, 'cb_KxFE1kQfP4oEp9E=', 'init()')
})

test('Encode empty arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('test_empty', [])
    t.is(encoded, 'cb_KxFLLL5rP7TGyoM=', 'test_empty()')
})

test('Encode boolean arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('test_bool', [true, false])
    t.is(encoded, 'cb_KxGhC8WIK/9/56SENg==', 'test_bool()')
})

test('Number of arguments validation', t => {
    t.plan(2)

    t.throws(() => encoder.encodeCall('test_bool', [true]), {name: 'EncoderError'})

    t.throws(() => encoder.encodeCall('test_bool', [true, true, false]), {name: 'EncoderError'})
})

test('Encode optional arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('test_optional', [{1: [404]}])
    t.is(encoded, 'cb_KxG0+HBxG6+CAAEBG2+CAVSsnrJE', 'test_optional(Some(404))')
})

test('Encode unit arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('test_unit', [[]])
    t.is(encoded, 'cb_KxFnQZBhGz+2JrXN', 'test_unit(())')
})

test('Encode records', t => {
    t.plan(2)
    const encoded = encoder.encodeCall('test_record', [[0, 0]])
    t.is(encoded, 'cb_KxFMrKn+GysAAOlAPrs=', 'test_record({x = 0, y = 0})')

    const encodedNest = encoder.encodeCall('test_nested_record', [[[1, 2], 3, 4]])

    t.is(
        encodedNest,
        'cb_KxGQjbdUGzsrAgQGCNvA+iA=',
        'test_nested_record({origin = {x = 1, y = 2}, a = 3, b = 4})'
    )
})

test('Encode calldata', t => {
    t.plan(1)
    const encoded = encoder.encodeCall('test_template_maze', [
        {
            1: [
                [[1, 2], 3, 4],
                {2: [10]},
                20,
                [[1, 2], 3, 4],
            ],
        },
    ])
    t.is(
        encoded,
        'cb_KxGu5Sw8G6+CAAQBSzsrAgQGCK+EAAABAAIbFCg7KwIEBgj8xaf6',
        'test_template_maze(Any({origin = {x = 1, y = 2}, a = 3, b = 4}, Yep(10), 20, {origin = {x = 1, y = 2}, a = 3, b = 4}))'
    )
})

test('Decode calldata', t => {
    t.plan(1)
    const decoded = encoder.decodeCall('cb_KxGu5Sw8G6+CAAQBSzsrAgQGCK+EAAABAAIbFCg7KwIEBgj8xaf6')

    t.deepEqual(decoded, {
        functionId: 'aee52c3c',
        functionName: 'test_template_maze',
        args: [
            {
                1: [
                    [[1n, 2n], 3n, 4n],
                    {2: [10n]},
                    20n,
                    [[1n, 2n], 3n, 4n],
                ],
            },
        ],
    })
})

test('Decode implicit init (void) result', t => {
    t.plan(1)
    t.is(encoder.decodeResult('init', 'cb_Xfbg4g=='), undefined)
})

test('Decode unit return result', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decodeResult('test_unit', 'cb_P4fvHVw='),
        [] // ()
    )
})

test('Decode successful result', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decodeResult('test_complex_tuple', 'cb_WysCAq+EAAABAAIbBjMCBAYvAgIEBggrCgyRsE4R'),
        [
            [1n, 1n],
            {2: [3n]},
            [1n, 2n, 3n],
            new Map([
                [1n, 2n],
                [3n, 4n],
            ]),
            [5n, 6n],
        ],
        'test_complex_tuple(({x = 1, y = 1}, Yep(3), [1, 2, 3], {[1] = 2, [3] = 4}, (5, 6)))'
    )
})

test('Decode error result', t => {
    t.plan(2)
    // error message is just string, no FATE encoding
    const error = encoder.decodeResult(
        'test_unit',
        'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU',
        'error'
    )
    t.is(error, 'Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]')

    t.throws(() => encoder.decodeResult('test_unit', 'err_abc', 'error'), {name: 'FateTypeError'})
})

test('Decode revert result', t => {
    t.plan(1)

    // revert messages are FATE string encoded
    const revert = encoder.decodeResult('test_unit', 'cb_OXJlcXVpcmUgZmFpbGVkarP9mg==', 'revert')
    t.is(revert, 'require failed')
})

test('Decode unknown result', t => {
    t.plan(1)

    t.throws(() => encoder.decodeResult('test_unit', '123', 'unknown'), {name: 'EncoderError'})
})
