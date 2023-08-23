# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.4.0"></a>
## [0.4.3](https://github.com/mapbox/shp-write/compare/v0.4.0...v0.4.3) (2023-08-23)

- More README cleanup
- Actually fixed LineString handling (coerced to 4D array like polygon in order to correctly reuse polywriter)
- Updated more dependencies
- Added some JSDoc comments (WIP)
- Added custom projection (Thanks @arnoud-dv)
- Fixed types (Thanks @rooby)

<a name="0.4.0"></a>
## [0.4.0](https://github.com/mapbox/shp-write/compare/v0.3.2...v0.4.0) (2023-08-20)

* Upgrade JSZip and dbf dependencies
* Added types
* Added options for compression and type output to `zip` and `download`
* Added deprecation warning to `download` (not needed for this library)

<a name="0.3.2"></a>
## [0.3.2](https://github.com/mapbox/shp-write/compare/v0.3.1...v0.3.2) (2016-12-06)

## 0.2.8

* Minor bugfix

## 0.2.7

* Fixes support of Polygons with holes

## 0.2.4

* Changes compression buffer type to `nodebuffer` to fix usage in node
