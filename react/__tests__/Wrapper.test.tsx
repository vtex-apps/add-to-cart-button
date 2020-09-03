import React from 'react'
import { cleanup } from '@vtex/test-tools/react'

import Wrapper from '../Wrapper'
import AddToCartButton from '../AddToCartButton'
import { renderWithProductContext } from '../modules/testUtils'
import {
  StarColorTop,
  ProductOutOfStock,
  ProductWithInvalidAssemblies,
} from '../__fixtures__/productContext'

jest.mock('../AddToCartButton.tsx', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}))

const MockAddToCartButton = jest.fn(() => {
  return <button>Add to Cart</button>
})

beforeAll(() => {
  ;(AddToCartButton as typeof AddToCartButton & {
    mockImplementation: Function
  }).mockImplementation(MockAddToCartButton)
})

afterEach(() => {
  cleanup()
  MockAddToCartButton.mockClear()
})

describe('Wrapper component', () => {
  it('should pass all props received via blocks.json to AddToCart button correctly', () => {
    renderWithProductContext(
      <Wrapper
        isOneClickBuy={false}
        customToastUrl="customToastUrl"
        customOneClickBuyLink="customOneClickBuyLink"
      />,
      {}
    )

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        isOneClickBuy: false,
        customToastUrl: 'customToastUrl',
        customOneClickBuyLink: 'customOneClickBuyLink',
      }),
      {}
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

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        available: false,
      }),
      {}
    )
  })

  it('should evaluate isAvailable to false when productContext is empty', () => {
    renderWithProductContext(<Wrapper />, {})

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        available: false,
      }),
      {}
    )
  })

  it("should evaluate isAvailable to true when product's available quantity is greater than 0", () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        available: true,
      }),
      {}
    )
  })

  it('should evaluate isDisabled to true when product has invalid assembly options', () => {
    renderWithProductContext(<Wrapper />, ProductWithInvalidAssemblies)

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      {}
    )
  })

  it('should evaluate isDisabled to false when product does not have invalid assembly options', () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        disabled: false,
      }),
      {}
    )
  })

  it('should pass correct skuItems to AddToCartButton', () => {
    renderWithProductContext(<Wrapper />, StarColorTop)

    const expectedSkuItems = [
      {
        index: 0,
        id: '2000564',
        ean: '123456',
        productId: '2000024',
        quantity: 1,
        uniqueId: '',
        detailUrl: '/star-color-top/p',
        name: 'Top Star Color Shirt',
        brand: 'Kawasaki',
        category: '/Apparel & Accessories/Clothing/Tops/',
        productRefId: '998765',
        seller: '1',
        sellerName: 'VTEX',
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
        referenceId: [
          { Key: 'RefId', Value: '987134', __typename: 'Reference' },
        ],
      },
    ]

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        skuItems: expectedSkuItems,
      }),
      {}
    )
  })

  it('should pass correct skuItems received from props to AddToCartButton', () => {
    const mockSKUItems = [
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
        referenceId: [{ Key: 'Reference', Value: 'red star' }],
      },
      {
        id: '2000535',
        productId: '2000004',
        quantity: 1,
        uniqueId: '',
        detailUrl: '/st-tropez-shorts/p',
        name: 'St Tropez Top Shorts',
        brand: 'Samsung',
        category: '/Apparel & Accessories/Clothing/Bottoms/',
        productRefId: '01212',
        seller: '1',
        variant: 'Navy Blue',
        skuName: 'Navy Blue',
        price: 303000,
        listPrice: 303000,
        sellingPrice: 303000,
        sellingPriceWithAssemblies: 303000,
        measurementUnit: 'un',
        skuSpecifications: [],
        imageUrl:
          'https://storecomponents.vtexassets.com/arquivos/ids/155488-500-auto?width=500&height=auto&aspect=true',
        options: [],
        assemblyOptions: { added: [], removed: [], parentPrice: 3030 },
        referenceId: { Value: '' },
      },
    ]

    renderWithProductContext(<Wrapper skuItems={mockSKUItems} />, {})

    expect(MockAddToCartButton).toBeCalledWith(
      expect.objectContaining({
        skuItems: mockSKUItems,
      }),
      {}
    )
  })
})
