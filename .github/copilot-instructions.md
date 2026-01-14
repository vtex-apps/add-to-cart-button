# Add To Cart Button - AI Coding Agent Instructions

## Project Overview
VTEX IO Store Framework component that adds products to Minicart v2. Single responsibility: handle add-to-cart interactions with support for one-click buy, SKU selection, and shipping modal triggers.

## Architecture

### Component Structure
- **Entry Point**: `react/Wrapper.tsx` - Wraps AddToCartButton with product context and withToast HOC
- **Main Component**: `react/AddToCartButton.tsx` - Handles button rendering and cart operations
- **Data Mapping**: `react/modules/catalogItemToCart.ts` - Transforms product context to cart items
- **Assembly Logic**: `react/modules/assemblyOptions.ts` - Handles product customizations and pricing

### VTEX IO Patterns
- Store builder (`store/interfaces.json`) registers the `add-to-cart-button` block
- Schema in `store/contentSchemas.json` defines Site Editor props
- Dependencies declared in `manifest.json` are VTEX apps (e.g., `vtex.product-context`, `vtex.order-items`)
- Dev dependencies pull type definitions from VTEX CDN URLs (pattern: `http://vtex.vtexassets.com/_v/public/typings/...`)

### Key Dependencies & Their Usage
- **vtex.product-context**: Provides product data via `useProduct()` hook - wraps component to access selected item, quantity, assembly options
- **vtex.order-items**: `useOrderItems()` provides `addItems()` mutation for cart operations
- **vtex.pixel-manager**: `usePixel()` pushes analytics events (addToCart, custom events)
- **vtex.shipping-option-components**: `useShippingOptionState()` checks if shipping info exists before triggering modal
- **vtex.render-runtime**: `useRuntime()` for navigation and route info

## Development Workflow

### Build & Test Commands
```bash
yarn lint              # ESLint on TS/TSX files (auto-fixes)
yarn test              # Runs tests in react/ directory (vtex-test-tools)
yarn verify            # Pre-push check: lint + locale check + test
yarn lint:locales      # Validates i18n keys match across locales
yarn locales:fix       # Auto-fixes i18n inconsistencies
```

### Testing Approach
- Tests use `@vtex/test-tools/react` (wraps React Testing Library)
- Mock VTEX modules via `react/__mocks__/vtex.*` files
- Fixtures in `react/__fixtures__/` provide sample data
- Test pattern: render with mocked contexts, assert on DOM/behavior

### Internationalization
- Messages in `messages/*.json` (28+ locales)
- Reference locale: `en` (set in package.json `intl-equalizer` config)
- Use `react-intl`: `useIntl()` for hooks, `<FormattedMessage>` for JSX
- Husky pre-commit runs `yarn locales:fix` to ensure key consistency

## Code Conventions

### Component Patterns
1. **Fake Loading State**: After button click, apply 500ms (5s for one-click buy) fake loading to prevent double-clicks (see `FAKE_LOADING_DURATION`)
2. **Product Context Checks**: Always check `isEmptyContext` before accessing product data - component can render outside product context
3. **Event Propagation**: Default `onClickEventPropagation='disabled'` - stop clicks from bubbling unless explicitly enabled
4. **Price Handling**: Prices stored as cents (multiply by 100) when mapping to cart items

### TypeScript
- Strict typing with VTEX type definitions
- Use `ProductTypes` namespace from `vtex.product-context` for product data shapes
- Type definitions in `react/typings/*.d.ts` for VTEX dependencies

### CSS & Styling
- Use `useCssHandles()` from `vtex.css-handles` - defines customizable CSS hooks
- Handles declared in `CSS_HANDLES` array: `buttonText`, `buttonDataContainer`, `tooltipLabelText`
- No inline styles - rely on VTEX Styleguide components (Button, Tooltip)

### Assembly Options Deep Dive
- Assembly = product customizations (add-ons, toggles, inputs)
- Nested structure: assemblies can have children assemblies
- `transformAssemblyOptions()` recursively builds `options` array (for GraphQL) and `added`/`removed` arrays (for optimistic UI)
- **Critical**: All items pushed to `options` array regardless of quantity (fixes KI 743529) - changed in v0.30.1

## Common Gotchas

1. **Seller Selection**: Always fallback to `getDefaultSeller()` - finds `sellerDefault=true` or first seller
2. **Marketing Data**: Session params (UTM/UTMI) come from `window.__RENDER_8_SESSION__` via `useMarketingSessionParams` hook
3. **One-Click Buy Navigation**: Use `navigate()` for major>0 checkouts, `window.location.assign()` for legacy
4. **Checkout URL**: Import from `Utils.useCheckoutURL()` in `vtex.checkout-resources` - handles multi-checkout versions
5. **Assembly Price Calculation**: `sumAssembliesPrice()` recursively sums children prices - multiply by item quantity when adding to parent

## CI/CD
- GitHub Actions on PR: Danger CI, IO app test (`vtex/action-io-app-test`), Lint (`vtex/action-lint`)
- Yarn cache optimization via `actions/cache@v4`
- No direct publish step (VTEX IO deployment handled separately)
