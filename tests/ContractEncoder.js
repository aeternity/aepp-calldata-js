import fs from 'fs'
import test from './test.js'
import ContractEncoder from '../src/ContractEncoder.js'
import {
    FateTypeInt,
    FateTypeTuple,
} from '../src/FateTypes.js'

const encoder = new ContractEncoder()
const testContract = fs.readFileSync('./build/contracts/Test.aeb')

test('Decode basic contract', t => {
    t.plan(9)

    const contract = encoder.decode('cb_+HJGA6CQAsse7xqrjce/mDvteSZLzqBKYE8JbOjr5flAYmKjyMC4Ran+RNZEHwA3ADcAGg6CEXRlc3QaDoQRZWNobwEDP/5iqLSMBDcABwEDBJcvAhFE1kQfEWluaXQRYqi0jBV0ZXN0MoIvAIU2LjEuMAHQSNos')

    t.is(contract.tag, 70n)
    t.is(contract.vsn, 3n)
    t.is(contract.sourceHash, '9002cb1eef1aab8dc7bf983bed79264bcea04a604f096ce8ebe5f9406262a3c8')
    t.is(contract.compilerVersion, '6.1.0')
    t.is(contract.payable, true)
    t.deepEqual(contract.bytecode.symbols, { '44d6441f': 'init', '62a8b48c': 'test2' })
    t.deepEqual(contract.bytecode.annotations, new Map())

    t.deepEqual(contract.bytecode.functions[0], {
        id: '44d6441f',
        name: 'init',
        attributes: [],
        args: FateTypeTuple(),
        returnType: FateTypeTuple(),
        instructions: [[
            {
                mnemonic: 'STORE',
                args: [{ mod: 'var', arg: -1n}, {mod: 'immediate', arg: 'test'}]
            },
            {
                mnemonic: 'STORE',
                args: [{mod: 'var', arg: -2n}, {mod: 'immediate', arg: 'echo'}]
            },
            {
                mnemonic: 'RETURNR',
                args: [{ mod: 'immediate', arg: []}]
            }
        ]],
    })

    t.deepEqual(contract.bytecode.functions[1], {
        id: '62a8b48c',
        name: 'test2',
        attributes: ['payable'],
        args: FateTypeTuple(),
        returnType: FateTypeInt(),
        instructions: [[
            {mnemonic: 'RETURNR', args: [{mod: 'immediate', arg: 2n}]}
        ]]
    })
})

test('Decode contract with Chain.create', t => {
    t.plan(1)

    const contract = encoder.decode('cb_+NBGA6D+x/gUE1YYLmvMJDIzJK2ZFJyOM5sXubwJy+9TVt/ib8C4n7iE/kTWRB8ANwA3ABoOgj8BAz/+m66dXgA3AQdHAgwBAAwDAAwDNwEHDAOPbxX4U0YDoJg7mklGIIWH49uiZBksC7yUEVO88y4D7lTd8+T4TMK2wKOS/kTWRB8ANwEHNwAaBoIAAQM/jC8BEUTWRB8RaW5pdIIvAIk4LjAuMC1yYzEAowAAlS8CEUTWRB8RaW5pdBGbrp1eDW5ld4IvAIk4LjAuMC1yYzEAaSb5ng==')

    t.like(contract.bytecode.functions[1].instructions[0][3], {
        mnemonic: 'PUSH',
        args: [{
            mod: 'immediate',
            arg: {
                tag: 70n,
                vsn: 3n,
                sourceHash: '983b9a4946208587e3dba264192c0bbc941153bcf32e03ee54ddf3e4f84cc2b6',
                aevmTypeInfo: [],
                compilerVersion: '8.0.0-rc1',
                payable: false
            }
        }],
    })
})

test('Decode full featured contract', t => {
    const contract = encoder.decode(testContract.toString())

    t.plan(6)
    t.is(contract.tag, 70n)
    t.is(contract.vsn, 3n)
    t.is(contract.compilerVersion, '8.0.0-rc1')
    t.is(contract.payable, false)
    t.is(Object.keys(contract.bytecode.symbols).length, contract.bytecode.functions.length)
    t.deepEqual(contract.bytecode.annotations, new Map())
})
