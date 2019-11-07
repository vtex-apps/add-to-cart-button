import React, { FC, useContext, useCallback } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { compose } from 'recompose'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ADD_TO_CART } from 'vtex.checkout-resources/Mutations'
import { withToast, ToastContext, Button } from 'vtex.styleguide'

import { MapCatalogItemToCartReturn } from './utils'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  skuItems: MapCatalogItemToCartReturn[]
}

interface OrderFormContext {
  loading: boolean
  orderForm: OrderForm | undefined
  setOrderForm: (orderForm: Partial<OrderForm>) => void
}

const CSS_HANDLES = ['buyButtonText', 'buttonDataContainer']
const CONSTANTS = {
  SUCCESS_MESSAGE_ID: 'store/buybutton.buy-success',
  OFFLINE_BUY_MESSAGE_ID: 'store/buybutton.buy-offline-success',
  DUPLICATE_CART_ITEM_ID: 'store/buybutton.buy-success-duplicate',
  ERROR_MESSAGE_ID: 'store/buybutton.add-failure',
  SEE_CART_ID: 'store/buybutton.see-cart',
  CHECKOUT_URL: '/checkout/#/cart',
  TOAST_TIMEOUT: 3000,
}

const adjustItemsForMutationInput = (
  newItems: MapCatalogItemToCartReturn[]
): OrderFormItemInput[] => {
  return newItems.map(item => ({
    id: Number.parseInt(item.skuId),
    index: item.index,
    seller: item.seller,
    quantity: item.quantity,
    options: item.options,
  }))
}

const AddToCartButton: FC<Props & InjectedIntlProps> = ({
  intl,
  isOneClickBuy,
  available,
  disabled,
  skuItems,
  customToastUrl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { showToast } = useContext(ToastContext)
  const { orderForm, setOrderForm, loading }: OrderFormContext = useOrderForm()
  const translateMessage = useCallback(id => intl.formatMessage({ id: id }), [
    intl,
  ])
  const { rootPath = '' } = useRuntime()
  const checkoutUrl = rootPath + CONSTANTS.CHECKOUT_URL

  const resolveToastMessage = (success: boolean, isNewItem: boolean) => {
    if (!success) return translateMessage(CONSTANTS.ERROR_MESSAGE_ID)
    if (!isNewItem) return translateMessage(CONSTANTS.DUPLICATE_CART_ITEM_ID)

    const isOffline = window && window.navigator && !window.navigator.onLine
    const checkForOffline = !isOffline
      ? translateMessage(CONSTANTS.SUCCESS_MESSAGE_ID)
      : translateMessage(CONSTANTS.OFFLINE_BUY_MESSAGE_ID)

    return checkForOffline
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
          label: translateMessage(CONSTANTS.SEE_CART_ID),
          href: customToastUrl,
        }
      : undefined

    showToast({ message, action })
  }

  const [
    addToCart,
    { error: mutationError, loading: mutationLoading },
  ] = useMutation<{ addToCart: OrderForm }, { items: OrderFormItemInput[] }>(
    ADD_TO_CART
  )

  const handleAddToCart = async (event: Event) => {
    event.stopPropagation()
    event.preventDefault()

    const adjustedSkuItems = adjustItemsForMutationInput(skuItems)

    const mutationResult = await addToCart({
      variables: { items: adjustedSkuItems },
    })

    if (mutationError) {
      console.error(mutationError)
      toastMessage({ success: false, isNewItem: false })
      return
    }

    if (mutationResult.data && mutationResult.data.addToCart === orderForm) {
      toastMessage({ success: true, isNewItem: false })
      if (isOneClickBuy) {
        location.assign(checkoutUrl)
      }
    }

    // Update OrderForm from the context
    mutationResult.data && setOrderForm(mutationResult.data.addToCart)
    toastMessage({ success: true, isNewItem: true })
  }

  const availableButtonContent = (
    <div
      className={`${handles.buttonDataContainer} flex w-100 justify-between items-center`}>
      <FormattedMessage id="store/buy-button.add-to-cart">
        {message => <span className={handles.buyButtonText}>{message}</span>}
      </FormattedMessage>
    </div>
  )

  const unavailableButtonContent = (
    <FormattedMessage id="store/buyButton-label-unavailable">
      {message => <span className={handles.buyButtonText}>{message}</span>}
    </FormattedMessage>
  )

  return (
    <Button
      block
      disabled={disabled || !available || loading || mutationLoading}
      isLoading={mutationLoading}
      onClick={e => handleAddToCart(e)}>
      {available ? availableButtonContent : unavailableButtonContent}
    </Button>
  )
}

export default compose(
  withToast,
  injectIntl
)(AddToCartButton)
