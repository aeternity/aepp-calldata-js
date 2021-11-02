# Aeternity data serialization

Aeternity contract calldata encoding and results decoding library

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

## Serialization

The `encode` and `decode` methods of the `Encoder` accept and return contract byte arrays (a `cb_` prefixed string with base64check encoded binary data).

The library also provides serialization and deserialization methods to work with binary data, i.e.:

```javascript
const {Encoder} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')
const CONTRACT = 'Test'

const encoder = new Encoder(ACI)

const encodedBin = encoder.serialize(CONTRACT, 'test_string', ["whoolymoly"])
console.log(encodedBin)

const binData = new Uint8Array([0x29, 0x77, 0x68, 0x6f, 0x6f, 0x6c, 0x79, 0x6d, 0x6f, 0x6c, 0x79])
const decodedBin = encoder.deserialize(CONTRACT, 'test_string', binData)
console.log(decodedBin)
```

Expected output:
```
Uint8Array(18) [
   43,  17, 240, 204,  43, 149,
   27,  41, 119, 104, 111, 111,
  108, 121, 109, 111, 108, 121
]
FateString { name: 'string', _value: 'whoolymoly' }
```

The `serialize` method return a byte array while the `deserialize` method returns a wrapper object of the corresponding Sophia type.

**Wrapper objects are not backward compatible guaranteed interface.**
Each data type wrapper implements `valueOf` Javascript method that should be used to unbox the primitive (Javascript) type. 

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
| variant             | `Some(404)`, `None`                                         | Object (POJO)   | `{'Some': [404]}`, `{'None': []}`                                              |
| bits                | `Bits.none`, `Bits.all`  `Bits.set(Bits.none, 0)`           | BigInt          | `0b0n`, `-1n`, `0b00000001n`                                                   |
| hash                | `#001234d`                                                  | BigInt          | `BigInt("0x001234d")`                                                          |
| signature           | `#001234d`                                                  | BigInt          | `BigInt("0x001234d")`                                                          |
| address             | `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt`     | BigInt, String  | `BigInt("0xDE68BFE1B203E51F52351BA087F79B7828E6A140F0C314A670C7003B3FF57075")`, `ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt` |

- note the fixed structure of variant object with a single key - the variant constructor (i.e. ``Some`) and array of variant arguments as it's value.
- while Javascript Number and primitive `int` types can be used as well when `BigInt` type is expected it's not recommended because of it's `Number.MAX_SAFE_INTEGER` limitation.

## Data constructors

To easy `Variant` data construction this library provide the following constructors:

- `Variant(constructor, arg1, arg2, ...argN)`
- `Some(arg)`
- `None()`

Example:

Given the following Sophia entrypoint:
```sophia
entrypoint test_optional(a:option(int)) = a
```

Below encoder call groups are equivalent:

```javascript
const {Encoder, Variant, Some, None} = require('@aeternity/aepp-calldata')
const ACI = require('./Test.json')
const CONTRACT = 'Test'

const encoder = new Encoder(ACI)

encoder.encode(CONTRACT, 'test_optional', [{'None': []}])
encoder.encode(CONTRACT, 'test_optional', [Variant('None')])
encoder.encode(CONTRACT, 'test_optional', [None()])

encoder.encode(CONTRACT, 'test_optional', [{'Some': [404]}])
encoder.encode(CONTRACT, 'test_optional', [Variant('Some', 404)])
encoder.encode(CONTRACT, 'test_optional', [Some(404)])
```

## Versioning

This project follows the [semantic versioning](https://semver.org/spec/v2.0.0) guidelines.
Refer to the [CHANGELOG](CHANGELOG.md) for more information about releases.

## Development

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
