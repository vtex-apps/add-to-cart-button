import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart } from './modules/catalogItemToCart'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  customOneClickBuyLink: string
  showToast: Function
}

const Wrapper: FC<Props> = ({
  isOneClickBuy,
  available,
  disabled,
  customToastUrl,
  showToast,
  customOneClickBuyLink,
}) => {
  const productContext: ProductContextState = useProduct()
  const isEmptyContext = Object.keys(productContext).length === 0

  const product = productContext?.product
  const selectedItem = productContext?.selectedItem
  const assemblyOptions = productContext?.assemblyOptions
  const selectedSeller = productContext?.selectedItem?.sellers[0]
  const selectedQuantity =
    productContext?.selectedQuantity != null
      ? productContext.selectedQuantity
      : 1

  const skuItems = useMemo(
    () =>
      mapCatalogItemToCart({
        product,
        selectedItem,
        selectedQuantity,
        selectedSeller,
        assemblyOptions,
      }),
    [assemblyOptions, product, selectedItem, selectedQuantity, selectedSeller]
  )

  const checkAvailability = (availableProp: Props['available']) => {
    if (isEmptyContext) {
      return false
    }
    if (availableProp != null) {
      return availableProp
    }

    return Boolean(
      selectedSeller?.commertialOffer &&
        selectedSeller.commertialOffer.AvailableQuantity > 0
    )
  }
  const isAvailable = checkAvailability(available)

  const groupsValidArray =
    (assemblyOptions?.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []
  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)

  const checkDisabled = (disabledProp: Props['disabled']) => {
    if (isEmptyContext) {
      return true
    }
    if (disabledProp != null) {
      return disabledProp
    }

    return !areAssemblyGroupsValid
  }
  const isDisabled = checkDisabled(disabled)

  const areAllSkuVariationsSelected =
    !isEmptyContext && productContext?.skuSelector.areAllVariationsSelected

  return (
    <AddToCartButton
      allSkuVariationsSelected={areAllSkuVariationsSelected}
      skuItems={skuItems}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      disabled={isDisabled}
      customToastUrl={customToastUrl}
      showToast={showToast}
      customOneClickBuyLink={customOneClickBuyLink}
    />
  )
}

export default withToast(Wrapper)
