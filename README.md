# Aeternity data serialization

Aeternity contract calldata encoding and results decoding **standalone** library.

This is Javascript implementation of data serialization specified in [aeternity protocol](https://github.com/aeternity/protocol/blob/master/serializations.md#data).

While the only purpose of the library at the moment of this writing is solely to provide encoding and decoding respectively of contracts calldata and return data it may evolve to full-fledged serialization library of the full protocol specification.

## Installation

```bash
npm install -P @aeternity/aepp-calldata
```

## Quick Start

To work with contract calls with type information provided by ACI the `AciContractCallEncoder` class should be used. The constructor takes a single argument - [Sophia ACI](https://github.com/aeternity/aesophia/blob/master/docs/aeso_aci.md) as string.


NodeJS example:

```javascript
const {AciContractCallEncoder} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')
const CONTRACT = 'Test'

const encoder = new AciContractCallEncoder(ACI)
```

### Encoding calldata

The `encodeCall` method is used to encode calldata taking the contract name as first argument, then function name and list of contract call arguments as last argument.

Example:
```javascript
const encoded = encoder.encodeCall(CONTRACT, 'test_string', ["whoolymoly"])
console.log(`Encoded data: ${encoded}`)
```

Expected output:
```
Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
```

### Decoding call result

The `decodeResult` method is used to decode contract call result based on it's type. While the first two arguments are the same as the encoding method, the third one is the actual result to be decoded and last one is the result type which defaults to 'ok'.

Example:
```javascript
const decoded = encoder.decodeResult(CONTRACT, 'test_string', 'cb_KXdob29seW1vbHlGazSE')
console.log(`Decoded data: ${decoded}`)
```

Expected output:
```
Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
Decoded data: whoolymoly
```

### Contract call errors

FATE contract call error message is represented as encoded contract bytearray (`cb_` prefixed string).
However, revert messages are FATE string encoded, so the `decodeResult` method accepts forth argument with the result type.

Example:
```javascript
// error message
const error = encoder.decodeResult(
    CONTRACT,
    'test_string',
    'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU',
    'error'
)
console.log('Error: ' + error)

// revert message
const revert = encoder.decodeResult(CONTRACT, 'test_string', 'cb_OXJlcXVpcmUgZmFpbGVkarP9mg==', 'revert')
console.log('Revert: ' + revert)
```

Expected output:
```
Error: Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]
Revert: require failed
```

### Events

Example:
```javascript
const data = encoder.decodeEvent('Test', 'cb_dHJpZ2dlcmVk1FYuYA==', [
    34853523142692495808479485503424878684430196596020091237715106250497712463899n,
    17n
])
console.log(data)
```

Expected output:
```
{EventTwo: [17n, 'triggered']}
```

## Byte Arrays

Any contract bytearray can be decocded using the `ContractByteArrayEncoder` class.

Node that FATE does not carry some of the type informaton with the data:

- Record keys are lost
- Variant constructor names are lost
- Any user type information is lost
- STL type information is lost: i.e. Chain, AENS, Set, BLS12_381

Example:
```javascript
const {ContractByteArrayEncoder} = require('@aeternity/aepp-calldata')

const decodedString = encoder.decode('cb_KXdob29seW1vbHlGazSE')
console.log(`Decoded string: ${decodedString}`)

const decodedMap = encoder.decode('cb_LwEOfzGit9U')
console.log('Decoded map:', decodedMap)

```

Expected output:
```
Decoded string: whoolymoly
Decoded map: Map(1) { 7n => false }
```

The encoder could also work with explicit type information:

Example:
```javascript
const {ContractByteArrayEncoder, TypeResolver} = require('@aeternity/aepp-calldata')

const encoder = new ContractByteArrayEncoder()
const resolver = new TypeResolver()

const decodedString = encoder.decodeWithType('cb_KXdob29seW1vbHlGazSE', resolver.resolveType('string'))
console.log(`Decoded string: ${decodedString}`)

const type = resolver.resolveType({map: ['int', 'bool']})
const encodedMap = encoder.encodeWithType(new Map([[7n, false]]), type)
console.log('Encoded map:', encodedMap)

```

Expected output:
```
Decoded string: whoolymoly
Decoded map: Map(1) { 7n => false }
```

## FATE API Encoder

Any of the following FATE API data types can be encoded and decoded:
- key_block_hash
- micro_block_hash
- block_pof_hash
- block_tx_hash
- block_state_hash
- contract_bytearray
- contract_pubkey
- account_pubkey
- channel
- oracle_pubkey
- oracle_query_id
- peer_pubkey
- name
- tx_hash
- signature
- commitment
- bytearray

Example:
```javascript
const {FateApiEncoder} = require('@aeternity/aepp-calldata')
const encoder = new FateApiEncoder()

const encoded = encoder.encode('contract_bytearray', new Uint8Array())
console.log(`Encoded: ${encoded}`)

const decoded = encoder.decode('cb_Xfbg4g==')
console.log('Decoded:', decoded)
```

Expected output:
```
Encoded: cb_Xfbg4g==
Decoded: Uint8Array(0) []
```

Note that the encoder work with binary data, so that strings has to be encoded as `Uint8Array`.

String Example:
```javascript
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const encoded = encoder.encode('contract_bytearray', textEncoder.encode('whoolymoly'))
console.log(`Encoded: ${encoded}`)

const decoded = textDecoder.decode(encoder.decode('cb_d2hvb2x5bW9seeO2SW0='))
console.log('Decoded:', decoded)
```

Excepted output:
```
Encoded: cb_d2hvb2x5bW9seeO2SW0=
Decoded: whoolymoly
```

## Contract Encoder

Decodes contract metadata including bytecode.

Example:
```javascript
const {ContractEncoder} = require('@aeternity/aepp-calldata')
const encoder = new ContractEncoder()

const testContract = fs.readFileSync(path.resolve(__dirname, '../build/contracts/Test.aeb'))
const contract = encoder.decode(testContract.toString())

console.log('Contract:', contract)
```

Expected output (trimmed):
```
{
  tag: 70n,
  vsn: 3n,
  source_hash: 'e50758c624dcacd485db1f9e76208c5858dd968f6218637d055fd4a3b2850baa',
  aevmTypeInfo: [],
  compilerVersion: '6.1.0',
  payable: false,
  bytecode: {
    functions: [
      {
        id: '077a0e02',
        name: 'test_nested_list',
        attributes: [],
        args: {
          name: 'tuple',
          valueTypes: [
            {
              name: 'list',
              valuesType: { name: 'list', valuesType: { name: 'int' } }
            }
          ]
        },
        returnType: {
          name: 'list',
          valuesType: { name: 'list', valuesType: { name: 'int' } }
        },
        instructions: [
          [
            { mnemonic: 'RETURNR', args: [ { mod: 'arg', arg: 0n } ] }
          ]
        ]
      },
      .....
    ],
    symbols: {
      '67419061': 'test_unit',
      ....
    },
    annotations: Map(0) {}
  }
}
```

**Please note that the bytecode is for debugging/print purposes and it's structure WON'T be kept backward compatible**

## Data types

Using the library involves data types and their mappings from Sophia to JavaScript and vice versa.

| Sophia Type | Sophia Example                                          | Javascript type    | Javascript Example                                      |
|-------------|---------------------------------------------------------|--------------------|---------------------------------------------------------|
| int         | `63`, `-63`                                             | BigInt             | `63n`, `-63n`                                           |
| bool        | `true`, `false`                                         | Boolean            | `true`, `false`                                         |
| string      | `"whoolymoly"`                                          | String             | `"whoolymoly"`                                          |
| bytes       | `#beef`                                                 | BigInt             | `BigInt("0xbeef")`                                      |
| list        | `[1, 2, 3, 5, 8, 13, 21]`                               | Array              | `[1,2,3,5,8,13,21]`                                     |
| tuple       | `(true, false)`                                         | Array              | `[true, false]`                                         |
| map         | `{[7] = false}`                                         | Map, Object, Array | `new Map([[7, false]])`, `{7: false}`, `[[7, false]]`   |
| record      | `{x = 0, y = 0}`                                        | Object (POJO)      | `{x: 0, y: 0}`                                          |
| variant     | `Some(404)`, `None`                                     | Object (POJO)      | `{'Some': [404]}`, `{'None': []}`, `404`, `undefined`   |
| bits        | `Bits.none`, `Bits.all`  `Bits.set(Bits.none, 0)`       | BigInt             | `0b0n`, `-1n`, `0b00000001n`                            |
| hash        | `#001234d`                                              | BigInt             | `BigInt("0x001234d")`                                   |
| signature   | `#001234d`                                              | BigInt             | `BigInt("0x001234d")`                                   |
| address     | `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt` | String             | `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt` |
| Set.set     | `Set.from_list([1, 2, 3])`                              | Set, Array         | `new Set([1,2,3])`,`[1,2,3]`                            |
| BLS12_381.fr| `BLS12_381.int_to_fr(3735928559)`                       | BigInt             | `3735928559n`                                           |
| BLS12_381.fp| `BLS12_381.int_to_fp(3735928559)`                       | BigInt             | `3735928559n`                                           |

- note the fixed structure of variant object with a single key - the variant constructor (i.e. `Some`) and array of variant arguments as it's value.
- while Javascript Number and primitive `int` types can be used as well when `BigInt` type is expected it's not recommended because of it's `Number.MAX_SAFE_INTEGER` limitation.

## Versioning

This project follows the [semantic versioning](https://semver.org/spec/v2.0.0) guidelines.
Refer to the [CHANGELOG](CHANGELOG.md) for more information about releases.

## Public API

The backward compatibility promise signaled with semantic versioning [above](#versioning) is **only** applied to public API of this library,
that is only the module exports and [data types](#data-types) listed above.

The public API namely consist of below classes:

- [AciContractCallEncoder](./api/AciContractCallEncoder.js)
- [BytecodeContractCallEncoder](./api/BytecodeContractCallEncoder.js)
- [ContractByteArrayEncoder](./api/ContractByteArrayEncoder.js)
- [FateApiEncoder](./api/FateApiEncoder.js)
- [ContractEncoder](./api/ContractEncoder.js)
- [TypeResolver](./api/TypeResolver.js)

The public API is also defined in [TypeScript declation file](main.d.ts).

### Errors

Error names are also part of the public API and it is guaranteed to get the same error name between compatible versions.
Since error classes are not exported as public API, the library users should rely **only** on `Error.name` property to handle exceptions.
Please also note that **error messages are NOT part of the public API** and they may change any time between versions without notice.

## Development

Please make sure you get familiar with [Contributing Guidelines](CONTRIBUTING.md) first.

### Install

```bash
npm install
```

### Tests

Unit tests can be run with:

```bash
make tests
```

Integration tests:

```bash
make integration-tests
```

One can use the benchmarks to do relative comparison on performance for a given change:

```bash
make benchmark-tests
```

Verify browser compatibility with:

```bash
make browser-tests
```

To see the test coverage run:

```bash
make coverage
```
