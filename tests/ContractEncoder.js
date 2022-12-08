const test = require('./test')
const ContractEncoder = require('../src/ContractEncoder')
const {
    FateTypeInt,
    FateTypeTuple,
} = require('../src/FateTypes')

const encoder = new ContractEncoder()

test('Decode basic contract', t => {
    t.plan(9)

    const contract = encoder.decode('cb_+HJGA6CQAsse7xqrjce/mDvteSZLzqBKYE8JbOjr5flAYmKjyMC4Ran+RNZEHwA3ADcAGg6CEXRlc3QaDoQRZWNobwEDP/5iqLSMBDcABwEDBJcvAhFE1kQfEWluaXQRYqi0jBV0ZXN0MoIvAIU2LjEuMAHQSNos')

    t.is(contract.tag, 70n)
    t.is(contract.vsn, 3n)
    t.is(contract.source_hash, '9002cb1eef1aab8dc7bf983bed79264bcea04a604f096ce8ebe5f9406262a3c8')
    t.is(contract.compiler_version, '6.1.0')
    t.is(contract.payable, true)
    t.deepEqual(contract.bytecode.symbols, { '44d6441f': 'init', '62a8b48c': 'test2' })
    t.deepEqual(contract.bytecode.annotations, new Map())
    t.deepEqual(contract.bytecode.functions[0], {
        id: '44d6441f',
        attributes: [],
        args: FateTypeTuple(),
        returnType: FateTypeTuple(),
        instructions: [],
    })
    t.deepEqual(contract.bytecode.functions[1], {
        id: '62a8b48c',
        attributes: ['payable'],
        args: FateTypeTuple(),
        returnType: FateTypeInt(),
        instructions: [],
    })
})
