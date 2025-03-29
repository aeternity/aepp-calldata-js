import test from './test.js'
import FateComparator from '../src/FateComparator.js'
import FateInt from '../src/types/FateInt.js'
import FateBool from '../src/types/FateBool.js'
import FateString from '../src/types/FateString.js'
import FateList from '../src/types/FateList.js'
import FateMap from '../src/types/FateMap.js'
import FateTuple from '../src/types/FateTuple.js'
import FateVariant from '../src/types/FateVariant.js'
import FateBytes from '../src/types/FateBytes.js'
import FateBits from '../src/types/FateBits.js'
import {
    FateTypeInt,
    FateTypeBool,
    FateTypeString,
    FateTypeBits,
    FateTypeBytes,
    FateTypeList,
    FateTypeMap,
    FateTypeTuple,
    FateTypeVariant,
} from '../src/FateTypes.js'

const sort = (type, data) => {
    data.sort(FateComparator(type))

    return data
}

const FTInt = FateTypeInt()
const FTBool = FateTypeBool()

test('Compare primitive types', t => {
    t.plan(4)
    t.deepEqual(sort(FateTypeInt(), [3, new FateInt(3), 5, -7, 1, 0]), [
        -7,
        0,
        1,
        3,
        new FateInt(3),
        5,
    ])

    t.deepEqual(sort(FateTypeBool(), [true, false, false, new FateBool(true), true, true, false]), [
        false,
        false,
        false,
        true,
        new FateBool(true),
        true,
        true,
    ])

    t.deepEqual(
        sort(FateTypeString(), [
            'Z',
            'abc',
            '~',
            'a',
            'abcd',
            'bab',
            new FateString('bab'),
            'B',
            'ab',
            'b',
            'aa',
            'abd',
        ]),
        ['B', 'Z', 'a', 'b', '~', 'aa', 'ab', 'abc', 'abd', 'bab', new FateString('bab'), 'abcd']
    )

    t.deepEqual(
        sort(FateTypeBits(), [-1, 0, -1, new FateBits(0), 1, 1, new FateBits(1), 0, -1, 1]),
        [0, new FateBits(0), 0, 1, 1, new FateBits(1), 1, -1, -1, -1]
    )
})

test('Compare bytes', t => {
    t.plan(2)
    t.deepEqual(
        sort(FateTypeBytes(), [
            new FateBytes(BigInt('0xfedcba9876543210')),
            new FateBytes(0x10000000000000000000000000),
            new FateBytes(0xdeadfeed),
            new FateBytes(0xdeadbeef),
            new FateBytes(0x0deadbad),
        ]),
        [
            new FateBytes(0x0deadbad),
            new FateBytes(0x10000000000000000000000000),
            new FateBytes(0xdeadbeef),
            new FateBytes(0xdeadfeed),
            new FateBytes(BigInt('0xfedcba9876543210')),
        ]
    )

    t.deepEqual(
        sort(FateTypeBytes(), [
            new FateBytes('0xfedcba9876543210'),
            new FateBytes('0xdeadfeed'),
            new FateBytes('0xdeadbeef'),
            new FateBytes('0xdeadbad'),
        ]),
        [
            new FateBytes('0xdeadbad'),
            new FateBytes('0xdeadbeef'),
            new FateBytes('0xdeadfeed'),
            new FateBytes('0xfedcba9876543210'),
        ]
    )
})

// TODO support nested inner types
test('Compare lists', t => {
    t.plan(1)
    t.deepEqual(
        sort(FateTypeList(FateTypeInt()), [
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt(), [0, 1, 2]),
            new FateList(FateTypeInt(), [0, 1, 2, 3]),
            new FateList(FateTypeInt(), [0, 1]),
            new FateList(FateTypeInt(), [0, 0, 0]),
            new FateList(FateTypeInt(), [0, 1, 2]),
            new FateList(FateTypeInt()),
        ]),
        [
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt()),
            new FateList(FateTypeInt(), [0, 0, 0]),
            new FateList(FateTypeInt(), [0, 1]),
            new FateList(FateTypeInt(), [0, 1, 2]),
            new FateList(FateTypeInt(), [0, 1, 2]),
            new FateList(FateTypeInt(), [0, 1, 2, 3]),
        ]
    )
})

// TODO support nested inner types
test('Compare tuples', t => {
    t.plan(1)
    t.deepEqual(
        sort(FateTypeTuple(), [
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [false, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [false, 0]),
            new FateTuple([FTInt], [0]),
        ]),
        [
            new FateTuple([FTInt], [0]),
            new FateTuple([FTBool, FTInt], [false, 0]),
            new FateTuple([FTBool, FTInt], [false, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
            new FateTuple([FTBool, FTInt], [true, 1]),
        ]
    )
})

test('Compare variants', t => {
    t.plan(1)
    t.deepEqual(
        sort(FateTypeVariant(), [
            new FateVariant([0, 0, 1], 2),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 1, 0], 1),
            new FateVariant([1, 1], 1),
            new FateVariant([1, 1, 0], 1),
            new FateVariant([0, 0, 1], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 2, [7], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [0], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [-1], [FateTypeInt()]),
            new FateVariant([0, 0, 1], 0),
        ]),
        [
            new FateVariant([1, 1], 1),
            new FateVariant([0, 0, 1], 0),
            new FateVariant([0, 0, 1], 1),
            new FateVariant([0, 0, 1], 2),
            new FateVariant([0, 1, 0], 1),
            new FateVariant([1, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 1),
            new FateVariant([0, 0, 1, 0], 2, [-1], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [0], [FateTypeInt()]),
            new FateVariant([0, 0, 1, 0], 2, [7], [FateTypeInt()]),
        ]
    )
})

test('Compare maps', t => {
    t.plan(1)
    t.deepEqual(
        sort(FateTypeMap(FTInt, FTBool), [
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, []),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, true],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, true],
                [0, false],
            ]),
        ]),
        [
            new FateMap(FTInt, FTBool, []),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, true],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [0, false],
            ]),
            new FateMap(FTInt, FTBool, [
                [1, true],
                [3, true],
                [2, false],
                [0, true],
            ]),
        ]
    )
})
