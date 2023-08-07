const fs = require('fs')
const path = require('path')
const test = require('./test')
const BytecodeContractCallEncoder = require('../src/BytecodeContractCallEncoder')

const bytecode = fs.readFileSync(path.resolve(__dirname, './data/dex.aeb'))
const encoder = new BytecodeContractCallEncoder(bytecode.toString())

// Regression test: https://github.com/aeternity/aepp-calldata-js/issues/220
test('Decode DEX calldata', t => {
    t.plan(1)
    const decoded = encoder.decodeCall(
        'cb_KxGgrHPPa2+IDeC2s6dj/8BviDpZvO5MEQ1II58CoA+jduXx2lWO56qpkcyYegDPEXsvjZYgC3Z4A6FQn/dBnwKgTXIk+QipjYUkNnGNIj1ZprZMgRF6awlXqrSIIMLSXZifAKCZQMy2a+t5j2iXIdLDYmGd8j1HDxShNfxsbKzKti0jgW+GAYmRujgZr4IAAQA/J8U0MA==',
    )

    t.deepEqual(
        decoded,
        {
            functionId: 'a0ac73cf',
            functionName: 'swap_exact_tokens_for_tokens',
            args: [
                1000000000000000000n,
                4204599458791493000n,
                [
                  'ct_7tTzPfvv3Vx8pCEcuk1kmgtn4sFsYCQDzLi1LvFs8T5PJqgsC',
                  'ct_b7FZHQzBcAW4r43ECWpV3qQJMQJp5BxkZUGNKrqqLyjVRN3SC'
                ],
                'ak_2AVeRypSdS4ZosdKWW1C4avWU4eeC2Yq7oP7guBGy8jkxdYVUy',
                1690367047769n,
                { '0': [] }
            ]
        }
    )
})
