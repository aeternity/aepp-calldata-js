#!/bin/bash

set -eu -o pipefail

CONTRACT="contracts/Test.aes"
COMPILER="./bin/aesophia_cli"
TESTS_PATH="tests/Decoder.js"

function decode() {
    ${COMPILER:-} ${CONTRACT:-} --call_result_fun "$1" --call_result "$2" | tail -n+2
}

function test_decoder() {
    echo -n "$1 ("$2") -> "
    DECODED=$(decode "$1" "$2")
    echo "$DECODED"
    grep -FA 2 "$1" ${TESTS_PATH:-} | grep -qF "$DECODED"
}

test_decoder 'test_bool' 'cb_/8CwV/U='
test_decoder 'test_single_int' 'cb_b4MC7W/bKkpn'
test_decoder 'test_bytes' 'cb_nwEJvu+rlRrs'
test_decoder 'test_string' 'cb_KXdob29seW1vbHlGazSE'
test_decoder 'test_hash' 'cb_nwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/55Yfk'
test_decoder 'test_signature' 'cb_nwEBAAABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg/EV2+8'
test_decoder 'test_account_address' 'cb_nwCg3mi/4bID5R9SNRugh/ebeCjmoUDwwxSmcMcAOz/1cHVYbXWK'
test_decoder 'test_contract_address' 'cb_nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVPlirXw'
test_decoder 'test_oracle_address' 'cb_nwOgyvIqJE7awD0m8CoX2SOULQVc/IYjKLJaUcKEvJ1CDkkkbvWd'
test_decoder 'test_oracle_query_address' 'cb_nwSg7R7n3AJ40FzpUJRzxQqT1Dooso1QMvbffapEL+E3E0g6bqyq'
test_decoder 'test_bits' 'cb_TwBixWzt'
test_decoder 'test_bits' 'cb_zwH34yVW'
test_decoder 'test_bits' 'cb_TwEPbJQb'
test_decoder 'test_list' 'cb_cwIEBgoQGiqNmBRX'
test_decoder 'test_nested_list' 'cb_MyMCBCMGCCMKDPLAUC0='
test_decoder 'test_tuple' 'cb_K/9/fDzeoA=='
test_decoder 'test_nested_tuple' 'cb_Kyv/fyt//701yEI='
test_decoder 'test_simple_map' 'cb_LwEOfzGit9U='
test_decoder 'test_nested_map' 'cb_LwMALwEAfwIvAQL/BC8BEP8Q+3ou'
test_decoder 'test_variants' 'cb_r4QAAAEAAT8xtJ9f'
test_decoder 'test_variants' 'cb_r4QAAAEAAhsOfGqVXg=='
test_decoder 'test_template_variants' 'cb_r4IABAFLDv8SKhktM40='
test_decoder 'test_int_type' 'cb_DtbN98k='
test_decoder 'test_map_type' 'cb_LwENZm9vJjJRlLM='
test_decoder 'test_template_type' 'cb_DtbN98k='
test_decoder 'test_optional' 'cb_r4IAAQA/aHG2bw=='
test_decoder 'test_optional' 'cb_r4IAAQEbb4IBVPA+5jI='
test_decoder 'test_record' 'cb_KwAAUjeM0Q=='
test_decoder 'test_nested_record' 'cb_OysCBAYISeTR0A=='
test_decoder 'test_records_list' 'cb_MysAACsCAisEBMjzXEk='
test_decoder 'test_records_map' 'cb_LwMrAAArAgIrAgQrBggrbyQYKy5vIzf5arA='
test_decoder 'test_primitives_tuple' 'cb_ewL/EXRlc3RPAJ8BCb7vnwGBAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg+fAQEAAAECAwQFBgcICQoLDA0ODwABAgMEBQYHCAkKCwwNDg8AAQIDBAUGBwgJCgsMDQ4PAAECAwQFBgcICQoLDA0ODzwY0fk='
test_decoder 'test_addresses_tuple' 'cb_S58AoN5ov+GyA+UfUjUboIf3m3go5qFA8MMUpnDHADs/9XB1nwKgH8DQmexaE8uTKKMX/OzYUrH3SJ5eALoJVzw8LbaYVVOfA6DK8iokTtrAPSbwKhfZI5QtBVz8hiMoslpRwoS8nUIOSZ8EoO0e59wCeNBc6VCUc8UKk9Q6KLKNUDL2332qRC/hNxNI/pLnKw=='
test_decoder 'test_complex_tuple' 'cb_WysCAq+EAAABAAIbBjMCBAYvAgIEBggrCgyRsE4R'