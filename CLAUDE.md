# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VTEX IO Store Framework React component (`vtex.add-to-cart-button`) that adds products to Minicart v2. Handles add-to-cart interactions with support for one-click buy, SKU selection validation, assembly options (product customizations), and shipping modal triggers.

## Commands

```bash
yarn lint              # ESLint on TS/TSX files (auto-fixes)
yarn format            # Prettier on TS/JSON
yarn test              # Runs tests in react/ directory (vtex-test-tools)
yarn verify            # Pre-push: lint + locale check + test
yarn lint:locales      # Validates i18n keys match across 28+ locales
yarn locales:fix       # Auto-fixes i18n inconsistencies
```

Tests use `@vtex/test-tools/react` (React Testing Library wrapper). Mocks live in `react/__mocks__/`, fixtures in `react/__fixtures__/`.

## Architecture

```
Wrapper.tsx (entry point, withToast HOC, connects to VTEX product context)
  └─ AddToCartButton.tsx (button logic, click behaviors, pixel events, navigation)
      ├─ modules/catalogItemToCart.ts (transforms product context → cart items)
      ├─ modules/assemblyOptions.ts (recursive assembly/customization processing)
      └─ hooks/useMarketingSessionParams.ts (UTM/UTMI from session)
```

**Wrapper.tsx**: Entry point wrapped with `withToast`. Uses `useProduct()` to get product data, determines availability/disabled state, memoizes cart item mapping via `catalogItemToCart`.

**AddToCartButton.tsx**: Supports 4 click behaviors: `add-to-cart`, `go-to-product-page`, `ensure-sku-selection`, `add-to-cart-and-trigger-shipping-modal`. Tracks pixel events via `usePixel()`, handles one-click buy navigation, PWA install prompts.

**catalogItemToCart.ts**: Maps VTEX product context to `CartItem[]`. Prices are **integers in cents** (multiply by 100). Uses `getDefaultSeller()` fallback (finds `sellerDefault=true` or first seller).

**assemblyOptions.ts**: Recursively processes nested product customizations. `sumAssembliesPrice()` calculates total assembly cost. `transformAssemblyOptions()` builds options array for GraphQL mutation + added/removed metadata for optimistic UI. All items pushed to options regardless of quantity (KI 743529 fix).

## Key VTEX Dependencies

| Dependency | Hook/HOC | Purpose |
|---|---|---|
| vtex.product-context | `useProduct()`, `useProductDispatch()` | Product data, SKU selection |
| vtex.order-items | `useOrderItems()` | `addItems()` cart mutation |
| vtex.pixel-manager | `usePixel()` | Analytics (addToCart events) |
| vtex.styleguide | `withToast`, Button, Tooltip | UI components, notifications |
| vtex.render-runtime | `useRuntime()` | Navigation, route info |
| vtex.checkout-resources | `Utils.useCheckoutURL()` | Checkout URL (v1/v2) |
| vtex.shipping-option-components | `useShippingOptionState()` | Shipping modal trigger |
| vtex.css-handles | `useCssHandles()` | CSS customization hooks |

## Critical Patterns

- **Empty Context Guard**: Always check `isEmptyContext` before accessing product data — component can render outside product context
- **Prices as Cents**: All prices multiplied by 100 when mapping to cart items (integers, never decimals)
- **Fake Loading**: 500ms for normal add-to-cart, 5s for one-click buy to prevent double-clicks
- **Event Propagation**: Default `onClickEventPropagation='disabled'`
- **One-Click Navigation**: `navigate()` for major>0 checkouts, `window.location.assign()` for legacy
- **Marketing Session**: UTM/UTMI params from `window.__RENDER_8_SESSION__.sessionPromise` (async)
- **Seller Fallback**: `getDefaultSeller()` finds `sellerDefault=true` or falls back to first seller

## Store Builder

- `store/interfaces.json` registers the `add-to-cart-button` block pointing to Wrapper
- `store/contentSchemas.json` defines Site Editor props (`text`, `unavailableText`)
- VTEX IO builders: react 3.x, store 0.x, messages 1.x, docs 0.x

## i18n

- 28+ locales in `messages/`, reference locale: `en`
- Uses `react-intl`: `useIntl()` for hooks, `<FormattedMessage>` for JSX
- Message IDs prefixed with `store/add-to-cart.*` (storefront) and `admin/editor.*` (Site Editor)
- Pre-commit hook auto-runs `yarn locales:fix`

## CI/CD

GitHub Actions on PR to master: Danger CI, IO app test (`vtex/action-io-app-test`), Lint (`vtex/action-lint`). VTEX IO deployment handled separately.
