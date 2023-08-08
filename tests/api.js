const fs = require('fs')
const path = require('path')
const test = require('./test')
const aci = require('../build/contracts/Test.json')
const {
    Encoder,
    AciContractCallEncoder,
    BytecodeContractCallEncoder,
    ContractByteArrayEncoder,
    FateApiEncoder,
    ContractEncoder,
    TypeResolver,
} = require('../src/main')

const CONTRACT = 'Test'

test('Encoder (legacy) public API', t => {
    t.plan(6)
    const encoder = new Encoder(aci)
    const error = 'cb_VHlwZSBlcnJvciBvbiBjYWxsOiBbe2J5dGVzLDw8MjQwLDIsLi4uPj59XSBpcyBub3Qgb2YgdHlwZSBbe2J5dGVzLDMyfV3EtJjU'

    t.is(encoder.encode(CONTRACT, 'init', []), 'cb_KxFE1kQfP4oEp9E=', 'init()')
    t.is(encoder.decode(CONTRACT, 'init', 'cb_Xfbg4g=='), undefined)
    t.is(encoder.decodeContractByteArray('cb_/8CwV/U='), true)
    t.is(encoder.decodeFateString('cb_OXJlcXVpcmUgZmFpbGVkarP9mg=='), 'require failed')
    t.is(encoder.decodeString(error).toString(), 'Type error on call: [{bytes,<<240,2,...>>}] is not of type [{bytes,32}]')

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlcmVk1FYuYA==',
            [
                34853523142692495808479485503424878684430196596020091237715106250497712463899n,
                17
            ]
        ),
        {EventTwo: [17n, 'triggered']}
    )
})

test('AciContractCallEncoder public API', t => {
    t.plan(4)
    const encoder = new AciContractCallEncoder(aci)

    t.is(encoder.encodeCall(CONTRACT, 'init', []), 'cb_KxFE1kQfP4oEp9E=')
    t.is(encoder.decodeResult(CONTRACT, 'init', 'cb_Xfbg4g=='), undefined)

    t.deepEqual(
        encoder.decodeCall(CONTRACT, 'test_bool', 'cb_KxGhC8WIK/9/56SENg=='),
        {functionId: 'a10bc588', args: [true, false]}
    )

    t.deepEqual(
        encoder.decodeEvent(
            CONTRACT,
            'cb_dHJpZ2dlcmVk1FYuYA==',
            [
                34853523142692495808479485503424878684430196596020091237715106250497712463899n,
                17
            ]
        ),
        {EventTwo: [17n, 'triggered']}
    )
})

test('BytecodeContractCallEncoder public API', t => {
    t.plan(3)

    const bytecode = fs.readFileSync(path.resolve(__dirname, '../build/contracts/Test.aeb'))
    const encoder = new BytecodeContractCallEncoder(bytecode.toString())

    t.is(encoder.encodeCall('init', []), 'cb_KxFE1kQfP4oEp9E=')
    t.is(encoder.decodeResult('init', 'cb_Xfbg4g=='), undefined)

    t.deepEqual(
        encoder.decodeCall('cb_KxGhC8WIK/9/56SENg=='),
        {functionId: 'a10bc588', functionName: 'test_bool', args: [true, false]}
    )
})

test('ContractByteArrayEncoder public API', t => {
    t.plan(3)

    const encoder = new ContractByteArrayEncoder()
    const resolver = new TypeResolver()

    t.is(encoder.decode('cb_b4MC7W/bKkpn'), 191919n)
    t.is(encoder.decodeWithType('cb_b4MC7W/bKkpn', resolver.resolveType('int')), 191919n)
    t.is(encoder.encodeWithType(191919n, resolver.resolveType('int')), 'cb_b4MC7W/bKkpn')
})

test('FateApiEncoder public API', t => {
    t.plan(2)

    const encoder = new FateApiEncoder()

    t.is(encoder.encode('contract_bytearray', new Uint8Array()), 'cb_Xfbg4g==')
    t.deepEqual(encoder.decode('cb_Xfbg4g=='), new Uint8Array())
})

test('ContractEncoder public API', t => {
    t.plan(4)

    const encoder = new ContractEncoder()
    const contract = encoder.decode('cb_+HJGA6CQAsse7xqrjce/mDvteSZLzqBKYE8JbOjr5flAYmKjyMC4Ran+RNZEHwA3ADcAGg6CEXRlc3QaDoQRZWNobwEDP/5iqLSMBDcABwEDBJcvAhFE1kQfEWluaXQRYqi0jBV0ZXN0MoIvAIU2LjEuMAHQSNos')

    t.is(contract.tag, 70n)
    t.is(contract.vsn, 3n)
    t.is(contract.compilerVersion, '6.1.0')
    t.is(contract.sourceHash, '9002cb1eef1aab8dc7bf983bed79264bcea04a604f096ce8ebe5f9406262a3c8')
})

test('TypeResolver public API', t => {
    t.plan(1)

    const resolver = new TypeResolver()
    const encoder = new ContractByteArrayEncoder()
    const type = resolver.resolveType({map: ['int', 'bool']})
    const encoded = encoder.encodeWithType(new Map([[7n, false]]), type)

    t.is(encoded, 'cb_LwEOfzGit9U=')
})
