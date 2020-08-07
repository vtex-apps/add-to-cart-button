import React, { useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart, CartItem } from './modules/catalogItemToCart'
import { AssemblyOptions } from './modules/assemblyOptions'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  customOneClickBuyLink: string
  showToast: Function
  selectedSeller: Seller | undefined
  text?: string
  unavailableText?: string
  onClickBehavior?:
    | 'add-to-cart'
    | 'go-to-product-page'
    | 'ensure-sku-selection'
  skuItems?: CartItem[]
}

function checkAvailability(
  isEmptyContext: boolean,
  seller: Seller | undefined,
  availableProp: Props['available']
) {
  if (isEmptyContext) {
    return false
  }
  if (availableProp != null) {
    return availableProp
  }

  const availableProductQuantity = seller?.commertialOffer?.AvailableQuantity

  return Boolean(availableProductQuantity)
}

function checkDisabled(
  isEmptyContext: boolean,
  assemblyOptions: AssemblyOptions,
  disabledProp: Props['disabled']
) {
  if (isEmptyContext) {
    return true
  }
  if (disabledProp != null) {
    return disabledProp
  }

  const groupsValidArray =
    (assemblyOptions?.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []
  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)

  return !areAssemblyGroupsValid
}

const Wrapper = withToast(function Wrapper(props: Props) {
  const {
    isOneClickBuy,
    available,
    disabled,
    customToastUrl,
    showToast,
    customOneClickBuyLink,
    selectedSeller,
    unavailableText,
    text,
    onClickBehavior = 'add-to-cart',
  } = props
  const productContext: ProductContextState = useProduct()
  const isEmptyContext = Object.keys(productContext).length === 0

  const product = productContext?.product
  const itemsLength = product?.items?.length ?? 0
  const multipleAvailableSKUs = itemsLength > 1
  const selectedItem = productContext?.selectedItem
  const assemblyOptions = productContext?.assemblyOptions
  const seller = selectedSeller ?? productContext?.selectedItem?.sellers[0]
  const selectedQuantity =
    productContext?.selectedQuantity != null
      ? productContext.selectedQuantity
      : 1

  const skuItems = useMemo(
    () =>
      props.skuItems ??
      mapCatalogItemToCart({
        product,
        selectedItem,
        selectedQuantity,
        selectedSeller: seller,
        assemblyOptions,
      }),
    [
      assemblyOptions,
      product,
      props.skuItems,
      selectedItem,
      selectedQuantity,
      seller,
    ]
  )

  const isAvailable = checkAvailability(isEmptyContext, seller, available)

  const isDisabled = checkDisabled(isEmptyContext, assemblyOptions, disabled)

  const areAllSkuVariationsSelected =
    !isEmptyContext && productContext?.skuSelector.areAllVariationsSelected

  const productLink = {
    linkText: product?.linkText,
    productId: product?.productId,
  }

  return (
    <AddToCartButton
      text={text}
      skuItems={skuItems}
      disabled={isDisabled}
      showToast={showToast}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      customToastUrl={customToastUrl}
      unavailableText={unavailableText}
      customOneClickBuyLink={customOneClickBuyLink}
      allSkuVariationsSelected={areAllSkuVariationsSelected}
      productLink={productLink}
      onClickBehavior={onClickBehavior}
      multipleAvailableSKUs={multipleAvailableSKUs}
    />
  )
})

Wrapper.schema = {
  title: 'admin/editor.add-to-cart.title',
}

export default Wrapper
