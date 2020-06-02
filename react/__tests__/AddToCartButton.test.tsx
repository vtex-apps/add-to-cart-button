import React from 'react'
import { render, cleanup, act, fireEvent } from '@vtex/test-tools/react'

import AddToCartButton from '../AddToCartButton'

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
]

const mockMarketingData = {
  utmSource: 'testing utmSource',
  utmMedium: 'testing utmMedium',
  utmCampaign: 'testing utmCampaign',
  utmiCampaign: 'testing utmiCampaign',
  utmiPage: 'testing utmiPage',
  utmiPart: 'testing utmiPart',
}

const mockAddItem = jest.fn()
const mockPixelEventPush = jest.fn()

jest.mock('../hooks/useMarketingSessionParams', () => {
  return () => ({
    utmParams: {
      utmSource: mockMarketingData.utmSource,
      utmMedium: mockMarketingData.utmMedium,
      utmCampaign: mockMarketingData.utmCampaign,
    },
    utmiParams: {
      utmiCampaign: mockMarketingData.utmiCampaign,
      utmiPage: mockMarketingData.utmiPage,
      utmiPart: mockMarketingData.utmiPart,
    },
  })
})

jest.mock('vtex.order-items/OrderItems', () => ({
  useOrderItems: () => ({
    addItem: mockAddItem,
  }),
}))

jest.mock('vtex.pixel-manager/PixelContext', () => ({
  usePixel: () => ({ push: mockPixelEventPush }),
}))

afterEach(() => {
  mockAddItem.mockClear()
  mockPixelEventPush.mockClear()
  cleanup()
})

describe('AddToCartButton component', () => {
  it('should render correct message for unavailable button', () => {
    const { queryByText } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available={false}
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    expect(queryByText('Unavailable')).toBeTruthy()
  })

  it('should render correct message for available item', () => {
    const { queryByText } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    expect(queryByText('Add to cart')).toBeTruthy()
  })

  it('should render tooltip with correct message when not all SKU variations are selected', () => {
    const { queryByTestId, queryByText } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected={false}
      />
    )

    const tooltip = queryByTestId('Tooltip')
    const label = queryByText('Please select an option of each variation')

    expect(tooltip).toBeTruthy()
    expect(label).toBeTruthy()
  })

  it('should not render with tooltip if all SKU variations are selected', () => {
    const { queryByTestId } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    expect(queryByTestId('Tooltip')).toBeNull()
  })

  it('should pass correct skuItem object to addItem when user clicks on it', () => {
    const { queryByTestId } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available={false}
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    const button = queryByTestId('styleguide-button')

    expect(button).toBeTruthy()

    act(() => {
      if (button) {
        fireEvent.click(button)
      }
    })

    expect(mockAddItem).toBeCalledWith(mockSKUItems, mockMarketingData)
  })

  it('should pass correct marketing data info to addItem function', () => {
    const { queryByTestId } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available={false}
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    const button = queryByTestId('styleguide-button')

    expect(button).toBeTruthy()

    act(() => {
      if (button) {
        fireEvent.click(button)
      }
    })

    expect(mockAddItem).toBeCalledWith(mockSKUItems, mockMarketingData)
  })

  it('should sent correct information about SKU items to pixel event', () => {
    const { queryByTestId } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available={false}
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected
      />
    )

    const button = queryByTestId('styleguide-button')

    expect(button).toBeTruthy()

    act(() => {
      if (button) {
        fireEvent.click(button)
      }
    })

    const expectedPixelEvent = {
      event: 'addToCart',
      items: [
        {
          skuId: '2000564',
          variant: 'Red star',
          price: 3500,
          name: 'Top Star Color Shirt',
          quantity: 1,
          productId: '2000024',
          productRefId: '998765',
          brand: 'Kawasaki',
          category: 'Apparel & Accessories/Clothing/Tops',
          detailUrl: '/star-color-top/p',
          imageUrl:
            'https://storecomponents.vtexassets.com/arquivos/ids/155518/download--40-.png?v=636942495289870000',
          referenceId: 'red star',
        },
      ],
    }

    expect(mockPixelEventPush).toBeCalledWith(expectedPixelEvent)
  })

  it('should not add item to the cart if not all SKU variations are selected', () => {
    const { queryByTestId } = render(
      <AddToCartButton
        isOneClickBuy
        customOneClickBuyLink=""
        available={false}
        disabled={false}
        skuItems={mockSKUItems}
        customToastUrl=""
        showToast={() => {}}
        allSkuVariationsSelected={false}
      />
    )

    const button = queryByTestId('styleguide-button')

    expect(button).toBeTruthy()

    act(() => {
      if (button) {
        fireEvent.click(button)
      }
    })

    expect(mockAddItem).toHaveBeenCalledTimes(0)
  })
})
