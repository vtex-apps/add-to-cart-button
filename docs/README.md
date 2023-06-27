📢 Use this project, [contribute](https://github.com/vtex-apps/add-to-cart-button) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion). 

# Add To Cart Button

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The `add-to-cart-button` block is designed to add products to the [Minicart](https://developers.vtex.com/docs/apps/vtex.minicart/) (`minicart.v2`).

![image](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-add-to-cart-button-0.png)

> ⚠️ The **Add to Cart** button is only compatible with stores using Minicart v2. For these stores, it will function correctly on the Shelf component and the Product Details page. If you are using [Minicart v1](https://github.com/vtex-apps/minicart/blob/383d7bbd3295f06d1b5854a0add561a872e1515c/docs/README.md), you should configure the [Buy Button block](https://developers.vtex.com/docs/apps/vtex.store-components/buybutton) on the Product Details page and the [Product Summary Buy button](https://developers.vtex.com/docs/apps/vtex.product-summary/productsummarybuybutton) on the Shelf component instead.

## Configuration

1. Import the `vtex.add-to-cart-button` app to your theme dependencies in the `manifest.json` file, as follows:

```json
"dependencies": {
  "vtex.add-to-cart-button": "0.x"
}
```

2. Add the `add-to-cart-button` to another theme block using the product context, such as the `product-summary.shelf`. In the example below, the `add-to-cart-button` is added to the `flex-layout.row` block from the `store.product` template, which uses the product context:

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

| Prop name | Type | Description | Default value |
| - | - | - | - |
| `onClickBehavior` | `enum` | Controls what happens when users click the button. Possible values are: `go-to-product-page`, `add-to-cart`, and `ensure-sku-selection` (if multiple SKUs are available, users will be redirected to the product page to select the desired one. If the product only has 1 SKU available, it will be automatically added to the cart when the button is clicked). | `add-to-cart` |
| `onClickEventPropagation` | `enum` | Controls whether the 'onClick' event, triggered upon user clicks, should propagate to the parent elements of the page. Possible values are: `disabled` and `enabled`. | `disabled` |
| `isOneClickBuy` | `boolean` | Determines whether the user should be redirected to the checkout page (`true`) or not (`false`) when the **Add to Cart** button is clicked. | `false` |
| `customOneClickBuyLink`   | `string`  | Defines the link to which users will be redirected when the **Add to Cart** button is clicked, and the `isOneClickBuy` prop is set to `true`. | `/checkout/#/cart` |
| `customToastUrl` | `string`  | Defines the link to which users will be redirected when the toast (pop-up notification displayed when adding an item to the minicart) is clicked. | `/checkout/#/cart` |
| `text` | `string`  | Defines a custom text message to be displayed on the **Add to Cart** button. | `Add to cart` _(automatic translation will be applied following your store default language)_ |
| `unavailableText` | `string`  | Defines a custom text message to be displayed on the **Add to Cart** button when a product is unavailable. | `Unavailable` _(automatic translation will be applied following your store default language)_ |
| `customPixelEventId` | `string`  | Defines the `id` for the event that the button will send upon user interaction.                                                                                                                                                                                                                                                                                   | `undefined` |

## Customization

To apply CSS customizations to this and other blocks, follow the instructions in [Using CSS Handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

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
<table>
  <tr>
    <td align="center"><a href="https://github.com/JNussens"><img src="https://avatars0.githubusercontent.com/u/7662734?v=4" width="100px;" alt=""/><br /><sub><b>Jean Nussenzveig</b></sub></a><br /><a href="https://github.com/vtex-apps/add-to-cart-button/commits?author=JNussens" title="Code">💻</a></td>
    <td align="center"><a href="http://ygorneves.com"><img src="https://avatars1.githubusercontent.com/u/39542011?v=4" width="100px;" alt=""/><br /><sub><b>Ygor Neves</b></sub></a><br /><a href="https://github.com/vtex-apps/add-to-cart-button/commits?author=ygorneves10" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lucaspacheco-acct"><img src="https://avatars0.githubusercontent.com/u/59736416?v=4" width="100px;" alt=""/><br /><sub><b>Lucas Pacheco</b></sub></a><br /><a href="https://github.com/vtex-apps/add-to-cart-button/commits?author=lucaspacheco-acct" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
