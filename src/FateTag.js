/* eslint-disable key-spacing, indent */

// Definition of tag scheme.
// This has to follow the protocol specification.
module.exports = Object.freeze({
    SMALL_INT    :        0b0, // sxxxxxx 0 - 6 bit integer with sign bit
                                       // 1 Set below
    LONG_STRING  : 0b00000001, // 000000 01 | RLP encoded array - when size >= 64
    SHORT_STRING :       0b01, // xxxxxx 01 | [bytes] - when 0 < xxxxxx:size < 64
                                      // 11  Set below
    SHORT_LIST   :     0b0011, // xxxx 0011 | [encoded elements] when  0 < length < 16
                               // xxxx 0111
                               // 1010 0111
                               // 1011 0111
                               // 1100 0111
                               // 1101 0111
    LONG_TUPLE   : 0b00001011, // 0000 1011 | RLP encoded (size - 16) | [encoded elements],
    SHORT_TUPLE  :     0b1011, // xxxx 1011 | [encoded elements] when 0  <  size < 16
                                    // 1111 Set below
    LONG_LIST    : 0b00011111, // 0001 1111 | RLP encoded (length - 16) | [encoded elements]
    MAP          : 0b00101111, // 0010 1111 | RLP encoded size | [encoded key, encoded value]
    EMPTY_TUPLE  : 0b00111111, // 0011 1111
    POS_BITS     : 0b01001111, // 0100 1111 | RLP encoded integer (to be interpreted as bitfield)
    EMPTY_STRING : 0b01011111, // 0101 1111
    POS_BIG_INT  : 0b01101111, // 0110 1111 | RLP encoded (integer - 64)
    FALSE        : 0b01111111, // 0111 1111
                               // 1000 1111 - FREE (Possibly for bytecode in the future.)
    OBJECT       : 0b10011111, // 1001 1111 | ObjectType | RLP encoded Array
    VARIANT      : 0b10101111, // 1010 1111 | [encoded arities] | encoded tag | [encoded values]
    MAP_ID       : 0b10111111, // 1011 1111 | RLP encoded integer (store map id)
    NEG_BITS     : 0b11001111, // 1100 1111 | RLP encoded integer (infinite 1:s bitfield)
    EMPTY_MAP    : 0b11011111, // 1101 1111
    NEG_BIG_INT  : 0b11101111, // 1110 1111 | RLP encoded (integer - 64)
    TRUE         : 0b11111111, // 1111 1111

    // Object types
    OTYPE_ADDRESS       : 0,
    OTYPE_BYTES         : 1,
    OTYPE_CONTRACT      : 2,
    OTYPE_ORACLE        : 3,
    OTYPE_ORACLE_QUERY  : 4,
    OTYPE_CHANNEL       : 5,
})
