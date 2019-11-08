import React, { FC, useCallback } from 'react'
import { useMutation } from 'react-apollo'
import {
  FormattedMessage,
  injectIntl,
  InjectedIntlProps,
  defineMessages,
} from 'react-intl'
import { Button, Tooltip } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { addToCart as ADD_TO_CART } from 'vtex.checkout-resources/Mutations'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'

import { MapCatalogItemToCartReturn, compareObjects } from './utils'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  skuItems: MapCatalogItemToCartReturn[]
  showToast: Function
  allSkuVariationsSelected: boolean
}

interface OrderFormContext {
  loading: boolean
  orderForm: OrderForm | undefined
  setOrderForm: (orderForm: Partial<OrderForm>) => void
}

const CSS_HANDLES = ['buyButtonText', 'buttonDataContainer']
const CHECKOUT_URL = '/checkout/#/cart'

const messages = defineMessages({
  success: { id: 'store/addtocart.success', defaultMessage: '' },
  duplicate: { id: 'store/addtocart.duplicate', defaultMessage: '' },
  error: { id: 'store/addtocart.failure', defaultMessage: '' },
  seeCart: { id: 'store/addtocart.see-cart', defaultMessage: '' },
})

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
  showToast,
  allSkuVariationsSelected = true,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    orderForm,
    setOrderForm,
    loading,
  }: OrderFormContext = OrderForm.useOrderForm()
  const translateMessage = useCallback(
    (id: string) => intl.formatMessage({ id }),
    [intl]
  )
  const { navigate } = useRuntime()
  const dispatch = useProductDispatch()

  const resolveToastMessage = (success: boolean, isNewItem: boolean) => {
    if (!success) return translateMessage(messages.error.id)
    if (!isNewItem) return translateMessage(messages.duplicate.id)

    return translateMessage(messages.success.id)
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
          label: translateMessage(messages.seeCart.id),
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

  const handleAddToCart = async (event: React.MouseEvent) => {
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

    if (
      mutationResult.data &&
      compareObjects(mutationResult.data.addToCart, orderForm)
    ) {
      toastMessage({ success: true, isNewItem: false })
      return
    }

    // Update OrderForm from the context
    mutationResult.data && setOrderForm(mutationResult.data.addToCart)

    if (isOneClickBuy) {
      navigate({
        to: CHECKOUT_URL,
      })
    }

    toastMessage({ success: true, isNewItem: true })
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
      <FormattedMessage id="store/addtocart.add-to-cart">
        {message => <span className={handles.buyButtonText}>{message}</span>}
      </FormattedMessage>
    </div>
  )

  const unavailableButtonContent = (
    <FormattedMessage id="store/buyButton-label-unavailable">
      {message => <span className={handles.buyButtonText}>{message}</span>}
    </FormattedMessage>
  )

  const tooltipLabel = (
    <FormattedMessage id="store/addtocart.select-sku-variations">
      {message => <span className={handles.errorMessage}>{message}</span>}
    </FormattedMessage>
  )

  return allSkuVariationsSelected ? (
    <Button
      block
      disabled={disabled || !available || loading || mutationLoading}
      isLoading={mutationLoading}
      onClick={(e: React.MouseEvent) => handleClick(e)}
    >
      {available ? availableButtonContent : unavailableButtonContent}
    </Button>
  ) : (
    <Tooltip trigger="click" label={tooltipLabel}>
      <Button
        block
        disabled={disabled || !available || loading || mutationLoading}
        isLoading={mutationLoading}
        onClick={(e: React.MouseEvent) => handleClick(e)}
      >
        {available ? availableButtonContent : unavailableButtonContent}
      </Button>
    </Tooltip>
  )
}

export default injectIntl(AddToCartButton)
