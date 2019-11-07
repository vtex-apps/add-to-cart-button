import React, { FC } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { path } from 'ramda'
import { withToast } from 'vtex.styleguide'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart } from './utils'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  showToast: () => void
}

const BuyButtonWrapper: FC<Props> = ({
  isOneClickBuy,
  available,
  disabled,
  customToastUrl,
}) => {
  const productContext: ProductContextState | undefined = useProduct()

  const isEmptyContext =
    !productContext || Object.keys(productContext).length === 0

  const product = productContext && productContext.product
  const selectedItem = productContext && productContext.selectedItem
  const assemblyOptions = productContext && productContext.assemblyOptions
  const selectedSeller = path(['selectedItem', 'sellers', 0], productContext)
  const selectedQuantity =
    productContext && productContext.selectedQuantity != null
      ? productContext.selectedQuantity
      : 1

  const skuItems = mapCatalogItemToCart({
    product,
    selectedItem,
    selectedQuantity,
    selectedSeller,
    assemblyOptions,
  })

  const isAvailable =
    isEmptyContext || available != null
      ? available
      : selectedSeller &&
        selectedSeller.commertialOffer &&
        selectedSeller.commertialOffer.AvailableQuantity > 0

  const groupsValidArray =
    (assemblyOptions &&
      assemblyOptions.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []

  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)
  const isDisabled =
    isEmptyContext || disabled != null ? disabled : !areAssemblyGroupsValid

  return (
    <AddToCartButton
      skuItems={skuItems}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      disabled={isDisabled}
      customToastUrl={customToastUrl}
    />
  )
}

const EnhancedBuyButton = withToast(BuyButtonWrapper)

export default EnhancedBuyButton
