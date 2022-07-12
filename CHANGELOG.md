# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Security
### Fixed
- Fix encoding and decoding of singular tuples and records (optimization)
- Fix support of templated records
- Fix omitting of optional record fields 
- Fix encoding and decoding of long lists and tuples
### Added
- Add support for `unit` type
- Add support for `Set.set` stdlib type
### Changed
### Deprecated
### Removed

## [1.1.1] - 2022-03-15

## Fixed
- Depend on Buffer ponyfill for browser compatibility (#122)

## Added
- Add tests from root to browser bundle (#120)

## Changed
- Use own implementation of base58check (#122)
- Use blakejs version that doesn't refer to Buffer (#122)
- Update dependencies (#121)

## [1.1.0] - 2022-01-27

### Fixed
- Don't use ES2022 (yet) to support client application transpilers

### Added
- Custom errors
- Clarify Errors backward compatibility promise in the docs
- Add Events support and public API
- Add support for POJO as Fate map parameters

## [1.0.0] - 2021-12-07
- Same as 1.0.0-rc1

## [1.0.0-rc1] - 2021-11-24

### Fixed
- Fix resolving of contract state type (#71)
- Fix deserialisation of empty string (#78)
- Fix decoding of nested variants
- Don't refer to class name to allow minification

### Added
- Validate string in HexStringToByteArray (#80) 
- Clarify library pupose, public API and contribution (#83)
- Validate variant values (#79)
- Add decodeString public API (#96)

### Changed
- Revamp public API (#100)
- Unify variant public data structure (#81)
- Accept only ae-encoded addresses
- Support option type as exact value and null alongside variants (#85)
- Don't accept string as entire tuple or list
- Custom error message instead "can't convert to BigInt"

### Removed
- `serialize` method
- `deserialize` method

## [0.1.0] - 2021-08-04

### Added

- `Encoder` module with public API methods `encode` and `decode`
- Tests
- Documentation
