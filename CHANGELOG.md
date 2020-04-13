# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
-  New prop `selectedSeller`.

## [0.8.1] - 2020-03-24
### Fixed
- Pass `referenceId` to `addToCart` event payload as string, not as an object.

## [0.8.0] - 2020-03-24
### Added
- `referenceId` to `addToCart` event payload.

## [0.7.0] - 2020-03-20
### Added
- `tooltipLabelText` CSS handle.

## [0.6.0] - 2020-03-09
### Added
- Information regarding `marketingData` to parameters being passed upon calling `addToCart` so that the `OrderForm` can update itself to include `utm` and `utmi` information.

## [0.5.0] - 2020-02-20
### Changed
- Use `addItem` function from `OrderItems` context instead of calling mutation directly.

## [0.4.0] - 2020-01-13
### Added
- New fields `detailUrl` and `imageUrl` to items in `addToCart`.

## [0.3.0] - 2020-01-13
### Changed
- Use `render-runtime`'s `navigate` function to proceed to cart if the new checkout is installed in order to benefit from apollo cache.

## [0.2.3] - 2020-01-08
### Fixed
- `oneClickBuyLink` prop not working when `useRuntime()` did not return a `rootPath`.

## [0.2.2] - 2020-01-06
### Changed
- Make it render as available in SSR and wait for order form to load before calling the add to cart logic.

## [0.2.1] - 2019-12-19

## [0.2.0] - 2019-12-18
### Added
- A2HS prompt.

## [0.1.1] - 2019-11-21
### Fixed
- Bump `vtex.pixel-manager` major to `1.x`.

## [0.1.0] - 2019-11-18
### Added
- Initial release.

