# Aeternity data serialization

Aeternity contract calldata encoding and results decoding **standalone** library.

This is Javascript implementation of data serialization specified in [aeternity protocol](https://github.com/aeternity/protocol/blob/master/serializations.md#data).

While the only purpose of the library at the moment of this writing is solely to provide encoding and decoding respectively of contracts calldata and return data it may evolve to full-fledged serialization library of the full protocol specification.

## Installation

```bash
npm install -P @aeternity/aepp-calldata
```

## Quick Start

There is single module `Encoder` that should be imported and instantiated. The constructor takes a single argument - [Sophia ACI](https://github.com/aeternity/aesophia/blob/master/docs/aeso_aci.md) as string.

The `encode` method is used to encode calldata taking the contract name as first argument, then function name and list of contract call arguments as last argument.

The `decode` method is used to decode contract call results while the first two arguments are the same as the encoding method the last one is the actual result to be decoded.

NodeJS example:

```javascript
const {Encoder} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')
const CONTRACT = 'Test'

const encoder = new Encoder(ACI)

const encoded = encoder.encode(CONTRACT, 'test_string', ["whoolymoly"])
console.log(`Encoded data: ${encoded}`)

const decoded = encoder.decode(CONTRACT, 'test_string', 'cb_KXdob29seW1vbHlGazSE')
console.log(`Decoded data: ${decoded}`)
```

Expected output:
```
Encoded data: cb_KxHwzCuVGyl3aG9vbHltb2x5zwMSnw==
Decoded data: whoolymoly
```

## Contract call errors

FATE contract call error message is represented as `cb_` prefixed base64check encoded string,
to get the error as string one can use `decodeString` shorthand method instead of doing it in their codebase.
However, revert messages are FATE string encoded, so a different helper method `decodeFateString` should be used.

Example:
```javascript
const {Encoder} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')

const encoder = new Encoder(ACI)

// error message
const error = encoder.decodeString('cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU')
// note that decodeString returns a Buffer that has to be converted to string
console.log('Error: ' + error.toString())

// revert message
const revert = encoder.decodeFateString('cb_OXJlcXVpcmUgZmFpbGVkarP9mg==')
console.log('Revert: ' + revert)
```

Expected output:
```
Error: Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]
Revert: require failed
```

## Events

Example:
```javascript
const {Encoder} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')

const encoder = new Encoder(ACI)

 const data = encoder.decodeEvent('Test', 'cb_dHJpZ2dlcmVk1FYuYA==', [
     34853523142692495808479485503424878684430196596020091237715106250497712463899n,
     17
 ])
console.log(data)
```

Expected output:
```
{EventTwo: [17n, 'triggered']}
```

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

The public API namely consist of:

- `encode(contractName: string, functionName: string, arguments: Array<Data>): string`
- `decode(contractName: string, functionName: string, encodedData: string): Data`
- `decodeEvent(contractName: string, data: string, topics: Array<BigInt>): string`
- `decodeString(data: string): Buffer`
- `decodeFateString(data: string): string`

where `Data: Boolean | BigInt | String | Array | Map | Set | Object`

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
