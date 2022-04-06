#!/bin/bash

set -eu -o pipefail

CONTRACT="contracts/Test.aes"
COMPILER="./bin/aesophia_cli"
TESTS_PATH="tests/Encoder.js"

function encode() {
    ${COMPILER:-} --create_calldata ${CONTRACT:-} --call "$1" | tail -n+2
}

function test_encoder() {
    echo -n "$1 -> "
    ENCODED=$(encode "$1")
    echo "$ENCODED"
    grep -qF $ENCODED ${TESTS_PATH:-}
}

test_encoder 'init()'
test_encoder 'test_empty()'
test_encoder 'test_unit(())'
test_encoder 'test_bool(true, false)'
test_encoder 'test_single_int(63)'
test_encoder 'test_single_int(-63)'
test_encoder 'test_int(63, -63, 64, -64)'
test_encoder 'test_bytes(#beef)'
test_encoder 'test_string("whoolymoly")'
test_encoder 'test_hash(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)'
test_encoder 'test_signature(#000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f)'
test_encoder 'test_account_address(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt)'
test_encoder 'test_contract_address(ct_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)'
test_encoder 'test_oracle_address(ok_2YNyxd6TRJPNrTcEDCe9ra59SVUdp9FR9qWC5msKZWYD9bP9z5)'
test_encoder 'test_oracle_query_address(oq_2oRvyowJuJnEkxy58Ckkw77XfWJrmRgmGaLzhdqb67SKEL1gPY)'
test_encoder 'test_bits(Bits.none)'
test_encoder 'test_bits(Bits.all)'
test_encoder 'test_bits(Bits.set(Bits.none, 0))'
test_encoder 'test_list([1, 2, 3, 5, 8, 13, 21])'
test_encoder 'test_nested_list([[1,2],[3,4],[5,6]])'
test_encoder 'test_simple_map({[7] = false})'
test_encoder 'test_nested_map({[0] = {[0] = false}, [1] = {[1] = true}, [2] = {[8] = true}})'
test_encoder 'test_template_map({[17] = "abc"})'
test_encoder 'test_tuple((true, false))'
test_encoder 'test_nested_tuple(((true, false), (false, true)))'
test_encoder 'test_variants(No)'
test_encoder 'test_variants(Yep(7))'
test_encoder 'test_nested_variants(One(RelativeTTL(7)))'
test_encoder 'test_nested_variants(Two(AENS.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, RelativeTTL(7), {["pointer"] = AENS.ContractPt(ak_Ez6MyeTMm17YnTnDdHTSrzMEBKmy7Uz2sXu347bTDPgVH2ifJ)})))'
test_encoder 'test_template_variants(Any(7, true, 9, 21))'
test_encoder 'test_int_type(7)'
test_encoder 'test_map_type({["foo"] = 19})'
test_encoder 'test_fancy_map({[None()] = 1}, {[Some(0)] = 2})'
test_encoder 'test_template_type(7)'
test_encoder 'test_template_maze(Any({origin = {x = 1, y = 2}, a = 3, b = 4}, Yep(10), 20, {origin = {x = 1, y = 2}, a = 3, b = 4}))'
test_encoder 'test_record({x = 0, y = 0})'
test_encoder 'test_singleton_record({x = 0})'
test_encoder 'test_nested_record({origin = {x = 1, y = 2}, a = 3, b = 4})'
test_encoder 'test_lib_type(404)'
test_encoder 'test_optional(None)'
test_encoder 'test_optional(Some(404))'
test_encoder 'test_ttl(RelativeTTL(50))'
test_encoder 'test_ttl(FixedTTL(50))'
test_encoder 'test_pointee(AENS.AccountPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
test_encoder 'test_pointee(AENS.OraclePt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
test_encoder 'test_pointee(AENS.ContractPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
test_encoder 'test_pointee(AENS.ChannelPt(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt))'
test_encoder 'test_aens_name(AENS.Name(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, FixedTTL(100), {["pt1"] = AENS.AccountPt(ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR)}))'
test_encoder 'test_ga_meta_tx(Chain.GAMetaTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42))'
test_encoder 'test_paying_for_tx(Chain.PayingForTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42))'
test_encoder 'test_base_tx(Chain.SpendTx(ak_2gx9MEFxKvY9vMG5YnqnXWv1hCsX7rgnfvBLJS4aQurustR1rt, 42, "foo"))'
test_encoder 'test_set({to_map = {[21] = (), [13] = (), [8] = (), [5] = (), [3] = (), [2] = (), [1] = () }})'
