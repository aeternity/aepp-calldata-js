import test from './test.js'
import testContract from '../build/contracts/Test.aeb.json' with { type: 'json' }
import ContractEncoder from '../src/ContractEncoder.js'
import {
    FateTypeInt,
    FateTypeTuple,
} from '../src/FateTypes.js'

const encoder = new ContractEncoder()

const basicContractBytecode = 'cb_+HJGA6CQAsse7xqrjce/mDvteSZLzqBKYE8JbOjr5flAYmKjyMC4Ran+RNZEHwA3ADcAGg6CEXRlc3QaDoQRZWNobwEDP/5iqLSMBDcABwEDBJcvAhFE1kQfEWluaXQRYqi0jBV0ZXN0MoIvAIU2LjEuMAHQSNos'
const basicContract = {
    tag: 70n,
    vsn: 3n,
    sourceHash: '9002cb1eef1aab8dc7bf983bed79264bcea04a604f096ce8ebe5f9406262a3c8',
    compilerVersion: '6.1.0',
    payable: true,
    aevmTypeInfo: [],
    bytecode: {
        symbols: { '44d6441f': 'init', '62a8b48c': 'test2' },
        annotations: new Map(),
        functions: [{
            id: '44d6441f',
            name: 'init',
            attributes: [],
            args: FateTypeTuple(),
            returnType: FateTypeTuple(),
            instructions: [[
                {
                    mnemonic: 'STORE',
                    args: [
                        {mod: 'var', arg: -1n, type: {name: 'int'}},
                        {mod: 'immediate', arg: 'test', type: {name: 'string'}},
                    ]
                },
                {
                    mnemonic: 'STORE',
                    args: [
                        {mod: 'var', arg: -2n, type: {name: 'int'}},
                        {mod: 'immediate', arg: 'echo', type: {name: 'string'}},
                    ]
                },
                {
                    mnemonic: 'RETURNR',
                    args: [{mod: 'immediate', arg: [], type: {name: 'tuple', valueTypes: []}}]
                }
            ]],
        }, {
            id: '62a8b48c',
            name: 'test2',
            attributes: ['payable'],
            args: FateTypeTuple(),
            returnType: FateTypeInt(),
            instructions: [[
                {mnemonic: 'RETURNR', args: [{mod: 'immediate', arg: 2n, type: {name: 'int'}}]}
            ]]
        }],
    }
}

test('Decode basic contract', t => {
    t.plan(1)
    const contract = encoder.decode(basicContractBytecode)
    t.deepEqual(contract, basicContract)
})

test('Encode basic contract', t => {
    t.plan(1)
    const contract = encoder.encode(basicContract)
    t.is(contract, basicContractBytecode)
})

test('Decode contract with Chain.create', t => {
    t.plan(1)

    const contract = encoder.decode('cb_+NBGA6D+x/gUE1YYLmvMJDIzJK2ZFJyOM5sXubwJy+9TVt/ib8C4n7iE/kTWRB8ANwA3ABoOgj8BAz/+m66dXgA3AQdHAgwBAAwDAAwDNwEHDAOPbxX4U0YDoJg7mklGIIWH49uiZBksC7yUEVO88y4D7lTd8+T4TMK2wKOS/kTWRB8ANwEHNwAaBoIAAQM/jC8BEUTWRB8RaW5pdIIvAIk4LjAuMC1yYzEAowAAlS8CEUTWRB8RaW5pdBGbrp1eDW5ld4IvAIk4LjAuMC1yYzEAaSb5ng==')

    t.deepEqual(contract.bytecode.functions[1].instructions[0][3], {
        mnemonic: 'PUSH',
        args: [{
            mod: 'immediate',
            arg: {
                tag: 70n,
                vsn: 3n,
                sourceHash: '983b9a4946208587e3dba264192c0bbc941153bcf32e03ee54ddf3e4f84cc2b6',
                aevmTypeInfo: [],
                bytecode: {
                    functions: [{
                        id: '44d6441f',
                        name: 'init',
                        attributes: [],
                        args: { name: 'tuple', valueTypes: [{name: 'int'}]},
                        returnType: { name: 'tuple', valueTypes: [] },
                        instructions: [
                            [
                                {
                                    mnemonic: 'STORE',
                                    args: [{
                                        mod: 'var',
                                        arg: -1n,
                                        type: {
                                            name: 'int',
                                        },
                                    }, {
                                        mod: 'arg',
                                        arg: 0n,
                                        type: {
                                            name: 'int',
                                        },
                                    }],
                                },
                                {
                                    mnemonic: 'RETURNR',
                                    args: [{
                                        mod: 'immediate',
                                        arg: [],
                                        type: {
                                            name: 'tuple',
                                            valueTypes: [],
                                        },
                                    }],
                                },
                            ]
                        ]
                    }],
                    symbols: {
                        '44d6441f': 'init'
                    },
                    annotations: new Map()
                },
                compilerVersion: '8.0.0-rc1',
                payable: false
            },
            type: undefined,
        }],
    })
})

test('Decode and encode full featured contract', t => {
    const contract = encoder.decode(testContract)

    t.plan(8)
    t.is(contract.tag, 70n)
    t.is(contract.vsn, 3n)
    t.is(contract.compilerVersion, '8.0.0')
    t.is(contract.payable, false)
    t.is(Object.keys(contract.bytecode.symbols).length, contract.bytecode.functions.length)
    t.deepEqual(contract.bytecode.annotations, new Map())

    const bytecode = encoder.encode(contract)
    t.is(bytecode, testContract.toString())
    const contract2 = encoder.decode(bytecode)
    t.deepEqual(contract2, contract)
})
