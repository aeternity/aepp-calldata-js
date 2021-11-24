# Aeternity data serialization

Aeternity contract calldata encoding and results decoding **standalone** library.

This is Javascript imeplemtnation of data serialization specified in [aeternity protocol](https://github.com/aeternity/protocol/blob/master/serializations.md#data).

While the only purpose of the library at the moment of this writing is solely to provide serialize/deserialize and ecnode/decode respectively of contracts calldata and return data it may evolve to full fledged serialization library of the full protocol specification.

## Installation

This package is not published to NPM registry yet.

```bash
npm install -P @aeternity/aepp-calldata
```

## Quick Start

There is single module `Encoder` that should be imported and instanciated. The constructor takes a single argument - [Sophia ACI](https://github.com/aeternity/aesophia/blob/master/docs/aeso_aci.md) as string.

The `encode` method is used to encode calldata taking the contract name as first argument, then function name and list of contract call arguments as last argument.

The `decode` method is used to decode contract call results while the first two arguments are the same as the encoding method the last one is the actuall result to be decoded.

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

## Data types

Using the library involves data types and their mappings from Sophia to JavaScript and vice versa.

| Sophia Type         | Sophia Example                                              | Javascript type | Javascript Example                                                             |
| ------------------- | -----------                                                 | --------------- | -----------                                                                    |
| int                 | `63`, `-63`                                                 | BigInt          | `63n`, `-63n`                                                                  |
| bool                | `true`, `false`                                             | Boolean         | `true`, `false`                                                                |
| string              | `"whoolymoly"`                                              | String          | `"whoolymoly"`                                                                 |
| bytes               | `#beef`                                                     | BigInt          | `BigInt("0xbeef")`                                                             |
| list                | `[1, 2, 3, 5, 8, 13, 21]`                                   | Array           | `[1,2,3,5,8,13,21]`                                                            |
| tuple               | `(true, false)`                                             | Array           | `[true, false]`                                                                |
| map                 | `{[7] = false}`                                             | Map             | `new Map([[7, false]])`                                                        |
| record              | `{x = 0, y = 0}`                                            | Object (POJO)   | `{x: 0, y: 0}`                                                                 |
| variant             | `Some(404)`, `None`                                         | Object (POJO)   | `{'Some': [404]}`, `{'None': []}`, `404`, `undefined`                          |
| bits                | `Bits.none`, `Bits.all`  `Bits.set(Bits.none, 0)`           | BigInt          | `0b0n`, `-1n`, `0b00000001n`                                                   |
| hash                | `#001234d`                                                  | BigInt          | `BigInt("0x001234d")`                                                          |
| signature           | `#001234d`                                                  | BigInt          | `BigInt("0x001234d")`                                                          |
| address             | `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt`     | BigInt, String  | `BigInt("0xDE68BFE1B203E51F52351BA087F79B7828E6A140F0C314A670C7003B3FF57075")`, `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt` |

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
- `decodeString(data: string): Buffer`
- `decodeFateString(data: string): string`

where `Data: Boolean | BigInt | String | Array | Map | Object`

## Development

Please make sure you get familiar with [Contributing Guidelines](CONTRIBUTING.md) first.

### Install

```bash
npm install
```

### Tests

```bash
make tests
```

Verify browser compatibility with:

```bash
make browser-tests
```

To see the test coverage run:

```bash
make coverage
```
