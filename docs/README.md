📢 Use this project, [contribute](https://github.com/vtex-apps/add-to-cart-button) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion). 

# Add To Cart Button

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The `add-to-cart-button` is a block responsible for adding products in the [Minicart](https://vtex.io/docs/components/all/vtex.minicart@2.46.1/) (`minicart.v2`). 

:warning: **The Add to Cart Button block only effectively function i.e. only adds products to the Minicart if the store uses the Minicart v2**. When using the Minicart v1, the [Buy Button block](https://vtex.io/docs/components/all/vtex.store-components@3.114.4/buybutton/) should be used instead.

![image](https://user-images.githubusercontent.com/284515/70233985-69e13700-173e-11ea-91f7-6675a6a0e73b.png)

## Configuration

1. Import the `vtex.add-to-cart-button` app to your theme's dependencies in the manifest.json, for example:

```json
"dependencies": {
  "vtex.add-to-cart-button": "0.x"
}
```

2. Add the `add-to-cart-button` block to the desired block from the `store.product` template. For example:

```json
  "store.product": {
    "children": [
      "flex-layout.row#product",
    ]
  },
  "flex-layout.row#product": {
    "children": [
      "add-to-cart-button"
    ]
  }
```

| Prop name               | Type      | Description                                                                       | Default value        |
| ----------------------- | --------- | --------------------------------------------------------------------------------- | -------------------- |
| `isOneClickBuy`         | `boolean` | Whether the user should be redirected to the checkout page (`true`) or not (`false`) when the Add To Cart Button is clicked on.  | `false`              |
| `customOneClickBuyLink` | `string`  | Defines the link to where users will be redirected when the Add To Cart Button is clicked on and the `isOneClickBuy` prop is set to `true`. | `/checkout/#/cart` |
| `customToastURL`        | `string`  | Defines the link to where users will be redirected when the Toast (pop-up notification displayed when adding an item to your cart) is clicked on.  | `/checkout/#/cart`   |


## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles           |
| --------------------- |
| `buttonText`          |
| `buttonDataContainer` |
| `tooltipLabelText`    |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
