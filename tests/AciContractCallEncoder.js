import test from './test.js'
import AciContractCallEncoder from '../src/AciContractCallEncoder.js'
import aci from '../build/contracts/Test.json' with {type: 'json'}

const CONTRACT = 'Test'
const encoder = new AciContractCallEncoder(aci)

test('Encode implicit init', t => {
    t.plan(1)
    const encoded = encoder.encodeCall(CONTRACT, 'init', [])
    t.is(encoded, 'cb_KxFE1kQfP4oEp9E=', 'init()')
})

test('Encode empty arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall(CONTRACT, 'test_empty', [])
    t.is(encoded, 'cb_KxFLLL5rP7TGyoM=', 'test_empty()')
})

test('Number of arguments validation', t => {
    t.plan(2)

    t.throws(() => encoder.encodeCall(CONTRACT, 'test_bool', [true]), {name: 'EncoderError'})

    t.throws(() => encoder.encodeCall(CONTRACT, 'test_bool', [true, true, false]), {
        name: 'EncoderError',
    })
})

test('Encode unit arguments', t => {
    t.plan(1)
    const encoded = encoder.encodeCall(CONTRACT, 'test_unit', [[]])
    t.is(encoded, 'cb_KxFnQZBhGz+2JrXN', 'test_unit(())')
})

test('Encode calldata', t => {
    t.plan(1)
    const encoded = encoder.encodeCall(CONTRACT, 'test_template_maze', [
        {
            Any: [
                {origin: {x: 1, y: 2}, a: 3, b: 4},
                {Yep: [10]},
                20,
                {origin: {x: 1, y: 2}, a: 3, b: 4},
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
    const decoded = encoder.decodeCall(
        CONTRACT,
        'test_template_maze',
        'cb_KxGu5Sw8G6+CAAQBSzsrAgQGCK+EAAABAAIbFCg7KwIEBgj8xaf6'
    )

    t.deepEqual(decoded, {
        functionId: 'aee52c3c',
        args: [
            {
                Any: [
                    {origin: {x: 1n, y: 2n}, a: 3n, b: 4n},
                    {Yep: [10n]},
                    20n,
                    {origin: {x: 1n, y: 2n}, a: 3n, b: 4n},
                ],
            },
        ],
    })
})

test('Decode calldata without function name', t => {
    t.plan(1)
    const decoded = encoder.decodeFunction(
        'cb_KxGu5Sw8G6+CAAQBSzsrAgQGCK+EAAABAAIbFCg7KwIEBgj8xaf6'
    )

    t.deepEqual(decoded, {
        contractName: CONTRACT,
        functionName: 'test_template_maze',
        functionId: 'aee52c3c',
    })
})

test('Decode implicit init (void) result', t => {
    t.plan(1)
    t.is(encoder.decodeResult(CONTRACT, 'init', 'cb_Xfbg4g=='), undefined)
})

test('Decode unit return result', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decodeResult(CONTRACT, 'test_unit', 'cb_P4fvHVw='),
        [] // ()
    )
})

test('Decode successful result', t => {
    t.plan(1)
    t.deepEqual(
        encoder.decodeResult(
            CONTRACT,
            'test_complex_tuple',
            'cb_WysCAq+EAAABAAIbBjMCBAYvAgIEBggrCgyRsE4R'
        ),
        [
            {x: 1n, y: 1n},
            {Yep: [3n]},
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
        CONTRACT,
        'error',
        'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU',
        'error'
    )
    t.is(error, 'Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]')

    t.throws(() => encoder.decodeResult(CONTRACT, 'error', 'err_abc', 'error'), {
        name: 'FateTypeError',
    })
})

test('Decode revert result', t => {
    t.plan(1)

    // revert messages are FATE string encoded
    const revert = encoder.decodeResult(
        CONTRACT,
        'error',
        'cb_OXJlcXVpcmUgZmFpbGVkarP9mg==',
        'revert'
    )
    t.is(revert, 'require failed')
})

test('Decode unknown result', t => {
    t.plan(1)

    t.throws(() => encoder.decodeResult(CONTRACT, 'error', '123', 'unknown'), {
        name: 'EncoderError',
    })
})

test('Decode events', t => {
    t.plan(1)

    t.deepEqual(
        encoder.decodeEvent(CONTRACT, 'cb_dHJpZ2dlciAzIGRhdGGEhtnk', [
            31681207293023881403488055235089918158550553865217088186518345674953571854592n,
            1337n,
            0,
            1,
        ]),
        {EventThree: [1337n, false, 'trigger 3 data', 0b00000001n]}
    )
})
