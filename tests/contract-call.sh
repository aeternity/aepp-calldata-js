#!/bin/bash

set -eu -o pipefail

# Examples:
# contract-call.sh test_empty
# contract-call.sh test_bool "[true, false]"

CONTRACT_SRC="contracts/Test.aes"
DESCRIPTOR_SRC="build/${CONTRACT_SRC//.aes/.desc.json}"
WALLET_PATH="build/wallet"
WALLET_PASS="123"
# init() calldata
CALLDATA="[]"
export AECLI_NODE_URL="https://next.aeternity.io"
export AECLI_COMPILER_URL="cli8"

ACCOUNT=$(npx aecli account address --json $WALLET_PATH 2> /dev/null | jq -r '.publicKey' || true)
if [ -z $ACCOUNT ]; then
    ACCOUNT=$(npx aecli account create --json -P $WALLET_PASS $WALLET_PATH | jq -r '.publicKey')
    curl -sS -X POST https://faucet.ceres.aepps.com/account/$ACCOUNT > /dev/null
fi

if ! npx aecli inspect $ACCOUNT > /dev/null; then
    echo "Please feed the wallet" $ACCOUNT
    exit
fi

if [ ! -f $DESCRIPTOR_SRC ]; then
    npx aecli contract deploy \
        --json -P $WALLET_PASS --descrPath $DESCRIPTOR_SRC \
        $WALLET_PATH --contractSource $CONTRACT_SRC $CALLDATA > /dev/null
fi

function contract_call() {
    echo -n "$1(${@:2}) -> "
    npx aecli contract call \
        --callStatic --json \
        --descrPath $DESCRIPTOR_SRC \
        "$@" | jq -r '.result.returnValue'
}

contract_call "$@"
