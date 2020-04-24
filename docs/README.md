📢 Don't fork this project. Use, [contribute](https://github.com/vtex-apps/awesome-io#contributing), or open issues through [Store Discussion](https://github.com/vtex-apps/store-discussion).
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Add To Cart Button

`AddToCartButton` is a button responsible for handling events of adding products in the minicart.

![image](https://user-images.githubusercontent.com/284515/70233985-69e13700-173e-11ea-91f7-6675a6a0e73b.png)

## Configuration

1. Import the `vtex.add-to-cart-button`'s app to your theme's dependencies in the manifest.json, for example:

```json
"dependencies": {
  "vtex.add-to-cart-button": "0.x"
}
```

2. Add the `add-to-cart-button` block to any block bellow `store.product`. For example:

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
| `isOneClickBuy`         | `Boolean` | Should redirect to the checkout page or not                                       | `false`              |
| `customToastURL`        | `String`  | Set the link associated with the Toast created when adding an item to your cart.  | `/checkout/#/cart`   |
| `customOneClickBuyLink` | `String`  | Set the link to redirect the user when the `isOneClickBuy` prop is set to `true`. | `'/checkout/#/cart'` |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles           |
| --------------------- |
| `buttonText`          |
| `buttonDataContainer` |
| `tooltipLabelText`    |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
