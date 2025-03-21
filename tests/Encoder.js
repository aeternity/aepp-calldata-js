import test from './test.js'
import Encoder from '../src/Encoder.js'
import aci from '../build/contracts/Test.json' with { type: 'json' }

const CONTRACT = 'Test'
const encoder = new Encoder(aci)

test('Encode implicit init', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'init', [])
    t.is(encoded, 'cb_KxFE1kQfP4oEp9E=', 'init()')
})

test('Encode empty arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_empty', [])
    t.is(encoded, 'cb_KxFLLL5rP7TGyoM=', 'test_empty()')
})

test('Number of arguments validation', t => {
    t.plan(2)

    t.throws(
        () => encoder.encode(CONTRACT, 'test_bool', [true]),
        { name: 'EncoderError' }
    )

    t.throws(
        () => encoder.encode(CONTRACT, 'test_bool', [true, true, false]),
        { name: 'EncoderError' }
    )
})

test('Encode unit arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_unit', [[]])
    t.is(encoded, 'cb_KxFnQZBhGz+2JrXN', 'test_unit(())')
})

test('Encode boolean arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_bool', [true, false])
    t.is(encoded, 'cb_KxGhC8WIK/9/56SENg==', 'test_bool(true, false)')
})

test('Encode single int arguments', t => {
    t.plan(2)
    const encoded1 = encoder.encode(CONTRACT, 'test_single_int', [63])
    t.is(encoded1, 'cb_KxGcvF48G34gDHTz', 'test_single_int(63)')

    const encoded2 = encoder.encode(CONTRACT, 'test_single_int', [-63])
    t.is(encoded2, 'cb_KxGcvF48G/4zzZ4m', 'test_single_int(-63)')
})

test('Encode multiple int arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_int', [63, -63, 64, -64])
    t.is(encoded, 'cb_KxFAuEQES37+bwDvAODy1qs=', 'test_int(63, -63, 64, -64)')
})

test('Encode bytes arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_bytes', [0xbeef])
    t.is(encoded, 'cb_KxEe407MG58BCb7vI/elQA==', 'test_bytes(#beef)')
})

test('Encode bytes any size arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_bytes_any_size', [0xc0ffee])
    t.is(encoded, 'cb_KxGHDGcIG58BDcD/7uo6XoQ=', 'test_bytes_any_size(Bytes.to_any_size(#c0ffee))')
})

test('Encode string arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_string', ["whoolymoly"])
    t.is(encoded, 'cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==', 'test_string("whoolymoly")')
})

test('Encode hash arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(
        CONTRACT,
        'test_hash',
        ["0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f"]
    )
    t.is(
        encoded,
        'cb_KxEjJ6ybG58BgQABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PUyyi1w==',
        'test_hash(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)'
    )
})

test('Ensures hash in a proper format', t => {
    t.plan(1)
    t.throws(
        () => encoder.encode(CONTRACT, 'test_hash', [{}]),
        { message: 'Should be one of: Array, ArrayBuffer, hex string, Number, BigInt; got [object Object] instead' }
    )
})

test('Encode signature arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(
        CONTRACT,
        'test_signature',
        [`0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f`]
    )
    t.is(
        encoded,
        'cb_KxEbznV5G58BAQAAAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4P+jjEQA==',
        `test_signature(
            #000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f
            000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f
        )`
    )
})

test('Encode account address arguments', t => {
    t.plan(2)
    t.is(
        encoder.encode(
            CONTRACT,
            'test_account_address',
            ["ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt"]
        ),
        'cb_KxHgYyOEG58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1FYw7tQ==',
        'test_account_address(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt)'
    )

    t.throws(
        () => encoder.encode(CONTRACT, 'test_account_address', ['test-string']),
        { message: 'Account pubkey should start with ak_, got test-string instead' }
    )
})

test('Encode contract address arguments', t => {
    t.plan(1)
    t.is(
        encoder.encode(
            CONTRACT,
            'test_contract_address',
            ["ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ"]
        ),
        'cb_KxELEfrsG58CoB/A0JnsWhPLkyijF/zs2FKx90ieXgC6CVc8PC22mFVTzM0KJQ==',
        'test_contract_address(ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)'
    )
})

test('Encode oracle address arguments', t => {
    t.plan(1)
    t.is(
        encoder.encode(
            CONTRACT,
            'test_oracle_address',
            ["ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5"]
        ),
        'cb_KxGPms0RG58DoMryKiRO2sA9JvAqF9kjlC0FXPyGIyiyWlHChLydQg5Jyfi1MA==',
        'test_oracle_address(ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5)'
    )
})

test('Encode oracle query address arguments', t => {
    t.plan(1)
    t.is(
        encoder.encode(
            CONTRACT,
            'test_oracle_query_address',
            ["oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY"]
        ),
        'cb_KxFBufYfG58EoO0e59wCeNBc6VCUc8UKk9Q6KLKNUDL2332qRC/hNxNIgI8x6g==',
        'test_oracle_query_address(oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY)'
    )
})

test('Encode bits arguments', t => {
    t.plan(3)
    const encoded = encoder.encode(CONTRACT, 'test_bits', [[0]])
    t.is(encoded, 'cb_KxG27kGGG08Agq5jCw==', 'test_bits(Bits.none)')

    const encoded2 = encoder.encode(CONTRACT, 'test_bits', [[-1]])
    t.is(encoded2, 'cb_KxG27kGGG88BYlyOgw==', 'test_bits(Bits.all)')

    const encoded3 = encoder.encode(CONTRACT, 'test_bits', [[1]])
    t.is(encoded3, 'cb_KxG27kGGG08BD4ordQ==', 'test_bits(Bits.set(Bits.none, 0))')
})

test('Encode list arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_list', [[1,2,3,5,8,13,21]])
    t.is(encoded, 'cb_KxFLwdBRG3MCBAYKEBoquPlTeA==', 'test_list([1, 2, 3, 5, 8, 13, 21])')
})

test('Encode long list arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_list', [new Array(17).fill(42)])
    t.is(
        encoded,
        'cb_KxFLwdBRGx8BVFRUVFRUVFRUVFRUVFRUVFQudVVq',
        'test_list([42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42])'
    )
})

test('Ensures list is array', t => {
    t.plan(1)
    t.throws(
        () => encoder.encode(CONTRACT, 'test_list', ['test-string']),
        { message: 'Fate list must be an Array, got test-string instead' }
    )
})

test('Encode nested list arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_nested_list', [[[1,2],[3,4],[5,6]]])
    t.is(encoded, 'cb_KxEHeg4CGzMjAgQjBggjCgyQqs5t', 'test_nested_list([[1,2],[3,4],[5,6]])')
})

test('Encode map arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_simple_map', [new Map([[7, false]])])
    t.is(encoded, 'cb_KxHLN316Gy8BDn+vbmBO', 'test_simple_map({[7] = false})')
})

test('Encode map arguments with sorted keys', t => {
    const encoded = encoder.encode(CONTRACT, 'test_string_map', [[["fo", "a"], ["s", "a"]]])
    t.is(encoded, 'cb_KxFFPju5Gy8CBXMFYQlmbwVhMOIQaw==', 'test_string_map({["fo"] = "a", ["s"] = "a"})')

    const encoded2 = encoder.encode(
        CONTRACT,
        'test_string_map',
        [[
            // keep the order
            ["ynx*,t@K66L(KYxf7GW3", "a"],
            ["GTSnE%&8V3289VJ_ShLG", "a"],
            ["adFLS.fj8E1jt=C1efff", "a"],
            ["]!T+mi$hy$W:eMZGw}Kf", "a"],
            ["Lzm]F8-44H*{mj!fh]M!", "a"],
        ]]
    )
    t.is(
        encoded2,
        'cb_KxFFPju5Gy8FUUdUU25FJSY4VjMyODlWSl9TaExHBWFRTHptXUY4LTQ0SCp7bWohZmhdTSEFYVFdIVQrbWkkaHkkVzplTVpHd31LZgVhUWFkRkxTLmZqOEUxanQ9QzFlZmZmBWFReW54Kix0QEs2NkwoS1l4ZjdHVzMFYeU+O/8=',
        'test_string_map({["GTSnE%&8V3289VJ_ShLG"] = "a", ["ynx*,t@K66L(KYxf7GW3"] = "a", ["adFLS.fj8E1jt=C1efff"] = "a", ["]!T+mi$hy$W:eMZGw}Kf"] = "a", ["Lzm]F8-44H*{mj!fh]M!"] = "a"})'
    )
})

test('Encode map arguments by object', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_simple_map', [{ 7: false }])
    t.is(encoded, 'cb_KxHLN316Gy8BDn+vbmBO', 'test_simple_map({[7] = false})')
})

test('Ensures map is map, array, object', t => {
    t.plan(1)
    t.throws(
        () => encoder.encode(CONTRACT, 'test_simple_map', ['test-string']),
        {
            name: 'FateTypeError',
            message: 'Fate map must be one of: Map, Array, Object; got test-string instead'
        }
    )
})

test('Encode nested map arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_nested_map', [[
        [0, [[0, false]]],
        [1, [[1, true]]],
        [2, [[8, true]]],
    ]])
    t.is(
        encoded,
        'cb_KxFdEx+MGy8DAC8BAH8CLwEC/wQvARD/oZN9CA==',
        'test_nested_map({[0] = {[0] = false}, [1] = {[1] = true}, [2] = {[8] = true}})'
    )
})

test('Encode templated map arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_template_map', [new Map([[17, "abc"]])])
    t.is(encoded, 'cb_KxFQNXwJGy8BIg1hYmNLma/O', 'test_template_map({[17] = "abc"})')
})

test('Encode tuple arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_tuple', [[true, false]])
    t.is(encoded, 'cb_KxFbdB1sGyv/fzQzK9M=', 'test_tuple((true, false))')
})

test('Ensures tuple is array', t => {
    t.plan(1)
    t.throws(
        () => encoder.encode(CONTRACT, 'test_tuple', ['test-string']),
        { message: 'Fate tuple must be an Array, got test-string instead' }
    )
})

test('Encode nested tuple arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_nested_tuple', [[[true, false], [false, true]]])
    t.is(encoded, 'cb_KxHkKCkeGysr/38rf/+ZQRDt', 'test_nested_tuple(((true, false), (false, true)))')
})

test('Encode long tuple arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_long_tuple', [new Array(17).fill(42)])
    t.is(
        encoded,
        'cb_KxFNdSEgGwsBVFRUVFRUVFRUVFRUVFRUVFSv7rmw',
        'test_long_tuple((42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42))'
    )
})

test('Variant validation', t => {
    const invalidData = [
        0xdead,
        null,
        {One: [], Two: []},
        {Fail: 'me'},
        {Yep: [1,2,3]}
    ]

    t.plan(invalidData.length)

    invalidData.forEach(arg => {
        t.throws(
            () => encoder.encode(CONTRACT, 'test_variants', [arg]),
            { name: 'FateTypeError' }
        )
    })
})

test('Encode simple variant arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_variants', [{No: []}])
    t.is(encoded1, 'cb_KxFiWgvXG6+EAAABAAE/Yp8XdQ==', 'test_variants(No)')
})

test('Encode variant arguments with non-zero arity', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_variants', [{Yep: [7]}])
    t.is(encoded1, 'cb_KxFiWgvXG6+EAAABAAIbDv+CzlA=', 'test_variants(Yep(7))')
})

test('Encode variant arguments with nested variant', t => {
    t.plan(2)
    const encoded1 = encoder.encode(CONTRACT, 'test_nested_variants', [{One: [{RelativeTTL: [7]}]}])
    t.is(encoded1, 'cb_KxF1qXomG6+CAQEAG6+CAQEAGw7cNGqs', 'test_nested_variants(One(RelativeTTL(7)))')

    const encoded2 = encoder.encode(
        CONTRACT,
        'test_nested_variants',
        [{
            Two: [{
                'AENS.Name': [
                    'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
                    {RelativeTTL: [7]},
                    new Map([
                        ['pointer', {'AENS.ContractPt': ['ak_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ']}]
                    ])
                ]
            }]
        }]
    )

    t.is(
        encoded2,
        'cb_KxF1qXomG6+CAQEBG68DADufAKDeaL/hsgPlH1I1G6CH95t4KOahQPDDFKZwxwA7P/Vwda+CAQEAGw4vAR1wb2ludGVyr4QBAQEBAhufAKAfwNCZ7FoTy5Mooxf87NhSsfdInl4AuglXPDwttphVU1S4wEY=',
        'test_nested_variants(Two(AENS.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, RelativeTTL(7), {["pointer"] = AENS.ContractPt(ak_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)})))'
    )
})

test('Encode variant with template arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_template_variants', [{Any: [7, true, 9, 21]}])
    t.is(encoded, 'cb_KxHBGrepG6+CAAQBSw7/EiqgmPlL', 'test_template_variants(Any(7, true, 9, 21))')
})

test('Encode type aliases', t => {
    t.plan(2)
    const encoded = encoder.encode(CONTRACT, 'test_int_type', [7])
    t.is(encoded, 'cb_KxE9BFdGGw7F/9+f', 'test_int_type(7)')

    const encodedMap = encoder.encode(CONTRACT, 'test_map_type', [[["foo", 19]]])
    t.is(encodedMap, 'cb_KxEM7YA1Gy8BDWZvbybgU5Hd', 'test_map_type({["foo"] = 19})')
})

test('Encode fancy map', t => {
    t.plan(2)
    const encodedMap1 = encoder.encode(CONTRACT, 'test_fancy_map', [
        new Map([[{None: []}, 1]]),
        new Map([[{Some: [0]}, 2]])
    ])
    t.is(encodedMap1, 'cb_KxETMqtuKy8Br4IAAQA/Ai8Br4IAAQEbAASjVMXT', 'test_fancy_map({[None()] = 1}, {[Some(0)] = 2})')

    const encodedMap2 = encoder.encode(CONTRACT, 'test_fancy_map', [
        new Map([[undefined, 1]]),
        new Map([[0, 2]])
    ])
    t.is(encodedMap2, 'cb_KxETMqtuKy8Br4IAAQA/Ai8Br4IAAQEbAASjVMXT', 'test_fancy_map({[None()] = 1}, {[Some(0)] = 2})')
})

test('Encode template type', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_template_type', [7])
    t.is(encoded, 'cb_KxGoCvQ/Gw6liNMS', 'test_template_type(7)')
})

test('Encode template maze', t => {
    t.plan(1)
    const encoded = encoder.encode(
        CONTRACT,
        'test_template_maze',
        [{
            Any: [
                {origin: {x: 1, y: 2}, a: 3, b: 4},
                {Yep: [10]},
                20,
                {origin: {x: 1, y: 2}, a: 3, b: 4},
            ]
        }]
    )
    t.is(
        encoded,
        'cb_KxGu5Sw8G6+CAAQBSzsrAgQGCK+EAAABAAIbFCg7KwIEBgj8xaf6',
        'test_template_maze(Any({origin = {x = 1, y = 2}, a = 3, b = 4}, Yep(10), 20, {origin = {x = 1, y = 2}, a = 3, b = 4}))'
    )
})

test('Encode records', t => {
    t.plan(2)
    const encoded = encoder.encode(CONTRACT, 'test_record', [{x: 0, y: 0}])
    t.is(encoded, 'cb_KxFMrKn+GysAAOlAPrs=', 'test_record({x = 0, y = 0})')

    const encodedNest = encoder.encode(
        CONTRACT,
        'test_nested_record',
        [{origin: {x: 1, y: 2}, a: 3, b: 4}]
    )

    t.is(
        encodedNest,
        'cb_KxGQjbdUGzsrAgQGCNvA+iA=',
        'test_nested_record({origin = {x = 1, y = 2}, a = 3, b = 4})'
    )
})

test('Encode singleton record arguments', t => {
    t.plan(1)

    const encoded = encoder.encode(CONTRACT, 'test_singleton_record', [0])
    t.is(encoded, 'cb_KxE4cPprGwBIAy+t', 'test_singleton_record({x = 0})')
})

test('Encode template record arguments', t => {
    t.plan(1)

    const encoded = encoder.encode(CONTRACT, 'test_template_record', [{x: 0, y: 0}])
    t.is(encoded, 'cb_KxGua0Q7GysAANAfuis=', 'test_template_record({x = 0, y = 0})')
})

test('Encode option record arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(CONTRACT, 'test_option_record', [{x: 42}])
    t.is(encoded, 'cb_KxHYGGWQGytUr4IAAQA/vClLIw==', 'test_option_record({x = 42, y = None})')
})

test('Encode record with address and int in arguments', t => {
    t.plan(1)
    const encoded = encoder.encode(
        CONTRACT,
        'test_address_record',
        [{account: 'ak_2kE1RxHzsRE4LxDFu6WKi35BwPvrEawBjNtV788Gje3yqADvwR', amount: 42}]
    )
    t.is(
        encoded,
        'cb_KxF7CJtTGyufAKDl15J29uSuZc3z1ZG2rDJhj05+ymUb+Vx+U6wgnnIIalQBp8sy',
        'test_address_record({account = ak_2kE1RxHzsRE4LxDFu6WKi35BwPvrEawBjNtV788Gje3yqADvwR, amount = 42})'
    )
})

test('Encode namespaced arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_lib_type', [404])
    t.is(encoded1, 'cb_KxGExpeGG2+CAVT2R/aU', 'test_lib_type(404)')
})

test('Encode optional arguments', t => {
    t.plan(6)
    const encoded1 = encoder.encode(CONTRACT, 'test_optional', [{None: []}])
    t.is(encoded1, 'cb_KxG0+HBxG6+CAAEAP4sG0gs=', 'test_optional(None)')

    const encodedUndefined = encoder.encode(CONTRACT, 'test_optional', [undefined])
    t.is(encodedUndefined, 'cb_KxG0+HBxG6+CAAEAP4sG0gs=', 'test_optional(None)')

    const encodedNull = encoder.encode(CONTRACT, 'test_optional', [null])
    t.is(encodedNull, 'cb_KxG0+HBxG6+CAAEAP4sG0gs=', 'test_optional(None)')

    const encodedEmpty = encoder.encode(CONTRACT, 'test_optional', [])
    t.is(encodedEmpty, 'cb_KxG0+HBxG6+CAAEAP4sG0gs=', 'test_optional(None)')

    const encoded2 = encoder.encode(CONTRACT, 'test_optional', [{Some: [404]}])
    t.is(encoded2, 'cb_KxG0+HBxG6+CAAEBG2+CAVSsnrJE', 'test_optional(Some(404))')

    const encoded = encoder.encode(CONTRACT, 'test_optional', [404])
    t.is(encoded, 'cb_KxG0+HBxG6+CAAEBG2+CAVSsnrJE', 'test_optional(Some(404))')
})

test('Encode Chain.ttl arguments', t => {
    t.plan(2)
    const encoded1 = encoder.encode(CONTRACT, 'test_ttl', [{RelativeTTL: [50]}])
    t.is(encoded1, 'cb_KxGDonYLG6+CAQEAG2Smlh4I', 'test_ttl(RelativeTTL(50))')

    const encoded2 = encoder.encode(CONTRACT, 'test_ttl', [{FixedTTL: [50]}])
    t.is(encoded2, 'cb_KxGDonYLG6+CAQEBG2SzOT3Y', 'test_ttl(FixedTTL(50))')
})

test('Encode AENS.pointee arguments', t => {
    t.plan(4)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_pointee',
        [{'AENS.AccountPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded1,
        'cb_KxETYCAKG6+EAQEBAQAbnwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHV5nrYN',
        'test_pointee(AENS.AccountPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded2 = encoder.encode(
        CONTRACT,
        'test_pointee',
        [{'AENS.OraclePt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded2,
        'cb_KxETYCAKG6+EAQEBAQEbnwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHV1g9LO',
        'test_pointee(AENS.OraclePt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded3 = encoder.encode(
        CONTRACT,
        'test_pointee',
        [{'AENS.ContractPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded3,
        'cb_KxETYCAKG6+EAQEBAQIbnwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHXYPI6p',
        'test_pointee(AENS.ContractPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded4 = encoder.encode(
        CONTRACT,
        'test_pointee',
        [{'AENS.ChannelPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded4,
        'cb_KxETYCAKG6+EAQEBAQMbnwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHUl0JMb',
        'test_pointee(AENS.ChannelPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )
})

test('Encode AENSv2.pointee arguments', t => {
    t.plan(5)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_pointee_v2',
        [{'AENSv2.AccountPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded1,
        'cb_KxElnEHfG6+FAQEBAQEAG58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB10byw+g==',
        'test_pointee_v2(AENSv2.AccountPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded2 = encoder.encode(
        CONTRACT,
        'test_pointee_v2',
        [{'AENSv2.OraclePt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded2,
        'cb_KxElnEHfG6+FAQEBAQEBG58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1XO0VzQ==',
        'test_pointee_v2(AENSv2.OraclePt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded3 = encoder.encode(
        CONTRACT,
        'test_pointee_v2',
        [{'AENSv2.ContractPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded3,
        'cb_KxElnEHfG6+FAQEBAQECG58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1UFjoyQ==',
        'test_pointee_v2(AENSv2.ContractPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const encoded4 = encoder.encode(
        CONTRACT,
        'test_pointee_v2',
        [{'AENSv2.ChannelPt': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt']}]
    )
    t.is(
        encoded4,
        'cb_KxElnEHfG6+FAQEBAQEDG58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1547G3Q==',
        'test_pointee_v2(AENSv2.ChannelPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
    )

    const dataPt = Buffer.from('http://example.com')
    const encoded5 = encoder.encode(
        CONTRACT,
        'test_pointee_v2',
        [{'AENSv2.DataPt': [dataPt]}]
    )
    t.is(
        encoded5,
        'cb_KxElnEHfG6+FAQEBAQEEG58BSWh0dHA6Ly9leGFtcGxlLmNvbYixc9Q=',
        `test_pointee_v2(AENSv2.DataPt(Bytes.to_any_size(#${dataPt.toString('hex')})))`
    )
})

test('Encode AENS.name arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_aens_name',
        [
            {
                'AENS.Name': [
                    'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
                    {FixedTTL: [100]},
                    new Map([
                        ["pt1", {'AENS.AccountPt': ['ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR']}]
                    ])
                ]
            }
        ]
    )
    t.is(
        encoded1,
        'cb_KxF9Ou/tG68DADufAKDeaL/hsgPlH1I1G6CH95t4KOahQPDDFKZwxwA7P/Vwda+CAQEBG28kLwENcHQxr4QBAQEBABufAKDVzwhADpiCIvJutLAsj4kHdFdGchGm5tlV7bcHScajO9PzmRQ=',
        'test_aens_name(AENS.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, RelativeTTL(100), {["pt1"] = AENS.AccountPt(ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR)}))'
    )
})

test('Encode AENSv2.name arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_aens_name_v2',
        [
            {
                'AENSv2.Name': [
                    'ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt',
                    {FixedTTL: [100]},
                    new Map([
                        ["pt1", {'AENSv2.AccountPt': ['ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR']}]
                    ])
                ]
            }
        ]
    )
    t.is(
        encoded1,
        'cb_KxFjVV5kG68DADufAKDeaL/hsgPlH1I1G6CH95t4KOahQPDDFKZwxwA7P/Vwda+CAQEBG28kLwENcHQxr4UBAQEBAQAbnwCg1c8IQA6YgiLybrSwLI+JB3RXRnIRpubZVe23B0nGoztVU63L',
        'test_aens_name_v2(AENSv2.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, RelativeTTL(100), {["pt1"] = AENSv2.AccountPt(ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR)}))'
    )
})

test('Encode Chain.ga_meta_tx arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_ga_meta_tx',
        [{'Chain.GAMetaTx': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt', 42]}]
    )
    t.is(
        encoded1,
        'cb_KxGKKBrYG68CACufAKDeaL/hsgPlH1I1G6CH95t4KOahQPDDFKZwxwA7P/VwdVSFBs0q',
        'test_ga_meta_tx(Chain.GAMetaTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42))'
    )
})

test('Encode Chain.paying_for_tx arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_paying_for_tx',
        [{'Chain.PayingForTx': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt', 42]}]
    )
    t.is(
        encoded1,
        'cb_KxGFY3+SG68CACufAKDeaL/hsgPlH1I1G6CH95t4KOahQPDDFKZwxwA7P/VwdVQi1L6n',
        'test_paying_for_tx(Chain.PayingForTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42))'
    )
})

test('Encode Chain.base_tx arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(
        CONTRACT,
        'test_base_tx',
        [{'Chain.SpendTx': ['ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt', 42, 'foo']}]
    )
    t.is(
        encoded1,
        'cb_KxHC9sshG6+WAwAAAAAAAQEBAgECAgEBAQEBAQECAAA7nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVUDWZvb5zbO1o=',
        'test_base_tx(Chain.SpendTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42, "foo"))'
    )
})

test('Encode Set.set arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_set', [new Set([21, 13, 8, 5, 3, 2, 1])])
    t.is(
        encoded1,
        'cb_KxGKQqpqGy8HAj8EPwY/Cj8QPxo/Kj/NtsHo',
        'test_set({to_map = {[21] = (), [13] = (), [8] = (), [5] = (), [3] = (), [2] = (), [1] = () }})'
    )
})

test('Encode Set.set arguments as array', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_set', [[21, 13, 8, 5, 3, 2, 1]])
    t.is(
        encoded1,
        'cb_KxGKQqpqGy8HAj8EPwY/Cj8QPxo/Kj/NtsHo',
        'test_set({to_map = {[21] = (), [13] = (), [8] = (), [5] = (), [3] = (), [2] = (), [1] = () }})'
    )
})

test('Encode Set.set arguments filters unique', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_set', [[1, 1, 2, 2, 3, 3]])
    t.is(
        encoded1,
        'cb_KxGKQqpqGy8DAj8EPwY/4zqmUA==',
        'test_set({to_map = {[1] = (), [2] = (), [3] = ()}})'
    )
})

test('Validate Set.set arguments', t => {
    t.plan(1)
    t.throws(
        () => encoder.encode(CONTRACT, 'test_set', ['test-string']),
        {
            name: 'FateTypeError',
            message: `Fate set must be a Set or Array, got "test-string" instead`
        }
    )
})

test('Encode BLS12_381.fr arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_bls12_381_fr_param', [3735928559n])
    t.is(
        encoded1,
        'cb_KxGGqIQmG58BgUbsMhjlmzoRsER2OvS9hTSfZgwNoRX+Peu7jjoURHHErUZRAg==',
        'test_bls12_381_fr_param(BLS12_381.int_to_fr(3735928559))'
    )
})

test('Encode BLS12_381.fp arguments', t => {
    t.plan(1)
    const encoded1 = encoder.encode(CONTRACT, 'test_bls12_381_fp_param', [3735928559n])
    t.is(
        encoded1,
        'cb_KxHF76MoG58BwRQ3Lc3ciTfY+Biaee5HMAR780VdOQvNVg76DytRg9sgGee/Vr9o5zCq+dq22u31A6vdFQI=',
        'test_bls12_381_fp_param(BLS12_381.int_to_fp(3735928559))'
    )
})
