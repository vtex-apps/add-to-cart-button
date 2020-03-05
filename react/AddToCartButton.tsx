import React, { FC } from 'react'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { Button, Tooltip } from 'vtex.styleguide'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import { usePWA } from 'vtex.store-resources/PWAContext'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import { CartItem } from './modules/catalogItemToCart'
import useMarketingSessionParams from './hooks/useMarketingSessionParams'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  customOneClickBuyLink: string
  skuItems: CartItem[]
  showToast: Function
  allSkuVariationsSelected: boolean
}

const CSS_HANDLES = ['buttonText', 'buttonDataContainer']

const messages = defineMessages({
  success: { id: 'store/add-to-cart.success', defaultMessage: '' },
  duplicate: { id: 'store/add-to-cart.duplicate', defaultMessage: '' },
  error: { id: 'store/add-to-cart.failure', defaultMessage: '' },
  seeCart: { id: 'store/add-to-cart.see-cart', defaultMessage: '' },
})

const adjustSkuItemForPixelEvent = (skuItem: CartItem) => {
  // Changes this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = skuItem.category ? skuItem.category.slice(1, -1) : ''

  return {
    skuId: skuItem.id,
    variant: skuItem.variant,
    price: skuItem.price,
    name: skuItem.name,
    quantity: skuItem.quantity,
    productRefId: skuItem.productRefId,
    brand: skuItem.brand,
    category,
    detailUrl: skuItem.detailUrl,
    imageUrl: skuItem.imageUrl,
  }
}

const AddToCartButton: FC<Props> = ({
  isOneClickBuy,
  customOneClickBuyLink,
  available,
  disabled,
  skuItems,
  customToastUrl,
  showToast,
  allSkuVariationsSelected = true,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { addItem } = useOrderItems()
  const dispatch = useProductDispatch()
  const { rootPath = '', navigate } = useRuntime()
  const { url: checkoutURL, major } = useCheckoutURL()
  const { push } = usePixel()
  const { settings = {}, showInstallPrompt = undefined } = usePWA() || {}
  const { promptOnCustomEvent } = settings
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const resolveToastMessage = (success: boolean, isNewItem: boolean) => {
    if (!success) return translateMessage(messages.error)
    if (!isNewItem) return translateMessage(messages.duplicate)

    return translateMessage(messages.success)
  }

  const toastMessage = ({
    success,
    isNewItem,
  }: {
    success: boolean
    isNewItem: boolean
  }) => {
    const message = resolveToastMessage(success, isNewItem)

    const action = success
      ? {
          label: translateMessage(messages.seeCart),
          href: customToastUrl,
        }
      : undefined

    showToast({ message, action })
  }

  const handleAddToCart: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()

    const itemsAdded = addItem(skuItems, { ...utmParams, ...utmiParams })
    const pixelEventItems = skuItems.map(adjustSkuItemForPixelEvent)

    push({
      event: 'addToCart',
      items: pixelEventItems,
    })

    if (isOneClickBuy) {
      if (
        major > 0 &&
        (!customOneClickBuyLink || customOneClickBuyLink === checkoutURL)
      ) {
        navigate({ to: checkoutURL })
      } else {
        window.location.assign(
          `${rootPath}${customOneClickBuyLink || checkoutURL}`
        )
      }
    }

    toastMessage({ success: true, isNewItem: itemsAdded })

    /* PWA */
    if (promptOnCustomEvent === 'addToCart' && showInstallPrompt) {
      showInstallPrompt()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (dispatch) {
      dispatch({ type: 'SET_BUY_BUTTON_CLICKED', args: { clicked: true } })
    }

    if (allSkuVariationsSelected) {
      handleAddToCart(e)
    }
  }

  const availableButtonContent = (
    <div className={`${handles.buttonDataContainer} flex justify-center`}>
      <FormattedMessage id="store/add-to-cart.add-to-cart">
        {message => <span className={handles.buttonText}>{message}</span>}
      </FormattedMessage>
    </div>
  )

  const unavailableButtonContent = (
    <FormattedMessage id="store/buyButton-label-unavailable">
      {message => <span className={handles.buttonText}>{message}</span>}
    </FormattedMessage>
  )

  const tooltipLabel = (
    <FormattedMessage id="store/add-to-cart.select-sku-variations">
      {message => <span className={handles.errorMessage}>{message}</span>}
    </FormattedMessage>
  )

  const ButtonWithLabel = (
    <Button block disabled={disabled || !available} onClick={handleClick}>
      {available ? availableButtonContent : unavailableButtonContent}
    </Button>
  )

  return allSkuVariationsSelected ? (
    ButtonWithLabel
  ) : (
    <Tooltip trigger="click" label={tooltipLabel}>
      {ButtonWithLabel}
    </Tooltip>
  )
}

export default AddToCartButton
