# Changelog
All notable changes to this project will be documented in [Github Release](https://github.com/aeternity/aepp-calldata-js/releases) descriptions.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Security
### Fixed
- Decoding long lists and maps (and any large FATE data) is no longer quadratic: deserializers work on views of the input instead of copying the remaining buffer for every decoded element.
### Added
- Add support for `bytes()` arbitrary-sized type from FATE 3.
- Add support for `AENSv2.pointee`, `AENSv2.name` types from FATE 3.
### Changed
### Deprecated
### Removed