import React, { ReactElement } from 'react'
import { render } from '@vtex/test-tools/react'

import { ProductContextProvider } from '../__mocks__/vtex.product-context'

export function renderWithProductContext(Component: ReactElement, value: any) {
  return render(
    <ProductContextProvider value={value}>{Component}</ProductContextProvider>
  )
}

export function findCSSHandles(container: HTMLElement, handles: string[]) {
  const foundNodes = handles
    .map(handle => {
      const foundNodesInner = container.getElementsByClassName(handle)
      return foundNodesInner.length > 0 ? handle : ''
    })
    .filter(result => result !== '')

  return foundNodes
}
