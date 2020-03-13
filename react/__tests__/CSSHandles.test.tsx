import React from 'react'
import { render } from '@vtex/test-tools/react'

import { findCSSHandles } from '../modules/testUtils'
import AddToCartButton from '../AddToCartButton'

const CSS_HANDLES_API = [
  'buttonText',
  'buttonDataContainer',
  'tooltipLabelText',
]

/**
 * It is not good practice to test the CSS and it goes against
 * the philosophy behind react-testing-library, but it is useful in our
 * case because our CSS handles are a public API.
 */
describe('CSS handles API', () => {
  it('should have all expected CSS handles', () => {
    const { container } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available
        disabled={false}
        skuItems={[]}
        customToastUrl={''}
        showToast={() => {}}
        allSkuVariationsSelected={false}
      />
    )

    const foundHandles = findCSSHandles(container, CSS_HANDLES_API)
    expect(foundHandles).toEqual(CSS_HANDLES_API)
  })
})
