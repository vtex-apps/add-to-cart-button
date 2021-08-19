# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.26.8] - 2021-08-19

### Fixed

- stopPropagation and preventDefault removed from `handleAddToCart` and added into `handleClick` in `AddToCartButton.tsx` to trigger too when no variation were selected.


## [0.26.7] - 2021-08-03

### Added

- I18n pseudolanguage to implement in-context tool.

## [0.26.6] - 2021-07-14

### Fixed

- Now, when `isOneClickBuy` is enabled, the users are only redirected when there's confirmation that the item was added to the cart

## [0.26.5] - 2021-06-17

### Fixed

- Crowdin configuration file.

## [0.26.4] - 2021-06-14

### Fixed

- Rollback changes introduced by v0.26.3.

## [0.26.3] - 2021-06-09 [YANKED]

### Fixed

- Check position on the screen to consider as scroll/click.

## [0.26.2] - 2021-05-20

### Fixed

- Behavior when scrolling on mobile.

## [0.26.1] - 2021-05-18

### Fixed
- Add to cart from mobile autocomplete.

## [0.26.0] - 2021-05-05

### Added 
- I18n It, Fr, Nl and Ko translations

### Changed
- Crowdin config. file
- Changelog

## [0.25.0] - 2021-04-29

### Added
- Add missing key `sellingPrice` on `CartItem` object sent to a `Pixel Event`
## [0.24.0] - 2021-04-21

### Added
- Property `allowedOutdatedData` is defined and passed to addItem mutation.

## [0.23.1] - 2021-03-30
### Fixed
- Use `sellerDefault` as default seller selection and fallback to first seller.

## [0.23.0] - 2021-03-17
### Added
- Property `priceIsInt` in `addToCart` pixel event, so it's possible to properly identify when to divide price by 100 in pixel apps.

## [0.22.0] - 2021-03-08

### Added

- I18n Ro and Jp.
- Crowdin configuration file.

## [0.21.1] - 2021-01-06
### Fixed
- Missing `preventDefault` call on `handleAddToCart` function.

## [0.21.0] - 2021-01-04
### Added
- `onClickEventPropagation` prop.

## [0.20.2] - 2020-12-14
### Fixed
- Use proper types.

## [0.20.1] - 2020-10-20

### Fixed
- Rollback changes introduced by v0.19.0.

## [0.20.0] - 2020-10-20

### Added
- Export `mapCatalogItemToCart` in react root folder.

## [0.19.0] - 2020-10-13 [YANKED]
### Fixed
- Use `navigate()` when redirecting to the checkout

## [0.18.0] - 2020-09-16
### Removed
- Message for duplicate item in cart.

## [0.17.0] - 2020-09-08
### Added
- `seller` to `addToCart` event.
- `sellerName` to `addToCart` event.

## [0.16.0] - 2020-09-08
### Added
- `customPixelEventId` prop.
- `addToCartFeedback` prop.

## [0.15.1] - 2020-09-02
### Fixed
- Timers being cleared before being fired.

## [0.15.0] - 2020-09-02
### Added
- A fake loading of 500ms to prevent accidental consecutive clicks.

## [0.14.0] - 2020-08-27
### Added
- `ean` to `addToCart` event.

## [0.13.5] - 2020-08-07
### Added
- `skuItems` prop to add more than one item to the cart.

## [0.13.4] - 2020-07-23
### Fixed
- Handling of recursive input values in assembly options.

## [0.13.3] - 2020-07-16
### Fixed
- Documentation for `customToastUrl` prop.

## [0.13.2] - 2020-07-13
### Fixed
- Minicart breaking if product category tree query resolves before the whole product query.
- Use proper type for `product` in `ProductContextState`.

## [0.13.1] - 2020-07-09
### Fixed
- Updated the README.md file to make the disclaimer regarding Minicart versions clearer. 

## [0.13.0] - 2020-07-08
### Added
- Support for redirecting users to product pages when there are multiple SKUs for the same product.

## [0.12.0] - 2020-06-04
### Added
- `onClickBehavior` prop to redirect user to product page (when defined as `go-to-product-page`).

## [0.11.1] - 2020-06-03

### Fixed
- Add 2 new props (https://github.com/vtex-apps/add-to-cart-button/pull/21) to the app documentation.

## [0.11.0] - 2020-06-02
### Added
- Item property `productId` to Pixel events.

## [0.10.2] - 2020-05-14

## [0.10.1] - 2020-05-14
### Fixed
- `add-to-cart-button` crashing if there is no image in the product.

## [0.10.0] - 2020-05-13
### Added
- `label` and `unavailableLabel` props to `add-to-cart-button`.
- Support for editing via Site Editor.

## [0.9.0] - 2020-04-13
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
