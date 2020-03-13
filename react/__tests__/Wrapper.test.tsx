/* eslint-disable no-console */
import React from 'react'
import { cleanup } from '@vtex/test-tools/react'

import { renderWithProductContext } from '../modules/testUtils'
import {
  StarColorTop,
  ProductOutOfStock,
  ProductWithInvalidAssemblies,
} from '../__fixtures__/productContext'
import Wrapper from '../Wrapper'

jest.mock('../AddToCartButton.tsx')

afterEach(cleanup)

describe('Wrapper component', () => {
  /**
   * To test the values this component passes down to AddToCartButton,
   * we use a mock implementation of the console.log() function.
   */
  const originalLog = console.log
  afterEach(() => (console.log = originalLog))

  let consoleOutput: Array<Record<string, any>> = []
  const mockedLog = (output: any) => consoleOutput.push(output)
  beforeEach(() => {
    console.log = mockedLog
    consoleOutput = []
  })

  it('should pass all props received via blocks.json to AddToCart button correctly', () => {
    renderWithProductContext(
      <Wrapper
        isOneClickBuy={false}
        customToastUrl="customToastUrl"
        customOneClickBuyLink="customOneClickBuyLink"
      />,
      StarColorTop
    )

    expect(consoleOutput[0].isOneClickBuy).toBe(false)
    expect(consoleOutput[0].customToastUrl).toEqual('customToastUrl')
    expect(consoleOutput[0].customOneClickBuyLink).toEqual(
      'customOneClickBuyLink'
    )
  })

  it('should not crash if productContext is empty', () => {
    const { container } = renderWithProductContext(
      <Wrapper
        isOneClickBuy={false}
        customToastUrl="customToastUrl"
        customOneClickBuyLink="customOneClickBuyLink"
      />,
      {}
    )

    expect(container.children).toBeDefined()
  })

  it('should evaluate isAvailable to false if product is out of stock', () => {
    renderWithProductContext(<Wrapper />, ProductOutOfStock)

    expect(consoleOutput[0].available).toBe(false)
  })

  it('should evaluate isAvailable to false when productContext is empty', () => {
    renderWithProductContext(<Wrapper />, {})

    expect(consoleOutput[0].available).toBe(false)
  })

  it("should evaluate isAvailable to true when product's available quantity is greater than 0", () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    expect(consoleOutput[0].available).toBe(true)
  })

  it('should evaluate isDisabled to true when product has invalid assembly options', () => {
    renderWithProductContext(<Wrapper />, ProductWithInvalidAssemblies)

    expect(consoleOutput[0].disabled).toBe(true)
  })

  it('should evaluate isDisabled to false when product does not have invalid assembly options', () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    expect(consoleOutput[0].disabled).toBe(false)
  })

  it('should pass correct skuItems to AddToCartButton', () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    const expectedOutput = [
      {
        index: 0,
        id: '2000564',
        productId: '2000024',
        quantity: 1,
        uniqueId: '',
        detailUrl: '/star-color-top/p',
        name: 'Top Star Color Shirt',
        brand: 'Kawasaki',
        category: '/Apparel & Accessories/Clothing/Tops/',
        productRefId: '998765',
        seller: '1',
        variant: 'Red star',
        skuName: 'Red star',
        price: 3500,
        listPrice: 3500,
        sellingPrice: 3500,
        sellingPriceWithAssemblies: 3500,
        measurementUnit: 'un',
        skuSpecifications: [],
        imageUrl:
          'https://storecomponents.vtexassets.com/arquivos/ids/155518/download--40-.png?v=636942495289870000',
        options: [],
        assemblyOptions: {
          added: [],
          parentPrice: 35,
          removed: [],
        },
      },
    ]

    expect(consoleOutput[0].skuItems).toStrictEqual(expectedOutput)
  })
})
