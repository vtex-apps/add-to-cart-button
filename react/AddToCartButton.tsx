import React, { useState, useEffect, useRef } from 'react'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { Tooltip } from 'vtex.styleguide'
import { Utils } from 'vtex.checkout-resources'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import { useProductDispatch } from 'vtex.product-context'
import { usePWA } from 'vtex.store-resources/PWAContext'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import { CartItem } from './modules/catalogItemToCart'
import useMarketingSessionParams from './hooks/useMarketingSessionParams'

import {ContainedButton} from 'tfgroup.custom-design-system';

interface ProductLink {
  linkText?: string
  productId?: string
}

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  multipleAvailableSKUs: boolean
  customToastUrl?: string
  customOneClickBuyLink?: string
  skuItems: CartItem[]
  showToast: Function
  allSkuVariationsSelected: boolean
  text?: string
  unavailableText?: string
  productLink: ProductLink
  onClickBehavior: 'add-to-cart' | 'go-to-product-page' | 'ensure-sku-selection'
  customPixelEventId?: string
  addToCartFeedback?: 'customEvent' | 'toast'
  onClickEventPropagation: 'disabled' | 'enabled'
  isLoading?: boolean
}

// We apply a fake loading to accidental consecutive clicks on the button
const FAKE_LOADING_DURATION = 500

function getFakeLoadingDuration(isOneClickBuy: boolean) {
  return isOneClickBuy ? FAKE_LOADING_DURATION * 10 : FAKE_LOADING_DURATION
}

const CSS_HANDLES = [
  'buttonText',
  'buttonDataContainer',
  'tooltipLabelText',
] as const

const messages = defineMessages({
  success: { id: 'store/add-to-cart.success' },
  duplicate: { id: 'store/add-to-cart.duplicate' },
  error: { id: 'store/add-to-cart.failure' },
  seeCart: { id: 'store/add-to-cart.see-cart' },
  skuVariations: {
    id: 'store/add-to-cart.select-sku-variations',
  },
  schemaTitle: { id: 'admin/editor.add-to-cart.title' },
  schemaTextTitle: { id: 'admin/editor.add-to-cart.text.title' },
  schemaTextDescription: { id: 'admin/editor.add-to-cart.text.description' },
  schemaUnavailableTextTitle: {
    id: 'admin/editor.add-to-cart.text-unavailable.title',
  },
  schemaUnavailableTextDescription: {
    id: 'admin/editor.add-to-cart.text-unavailable.description',
  },
})

const options = {
  allowedOutdatedData: ['paymentData'],
}

const mapSkuItemForPixelEvent = (skuItem: CartItem) => {
  // Changes this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = skuItem.category ? skuItem.category.slice(1, -1) : ''

  return {
    skuId: skuItem.id,
    ean: skuItem.ean,
    variant: skuItem.variant,
    price: skuItem.price,
    sellingPrice: skuItem.sellingPrice,
    priceIsInt: true,
    name: skuItem.name,
    quantity: skuItem.quantity,
    productId: skuItem.productId,
    productRefId: skuItem.productRefId,
    brand: skuItem.brand,
    category,
    detailUrl: skuItem.detailUrl,
    imageUrl: skuItem.imageUrl,
    referenceId: skuItem?.referenceId?.[0]?.Value,
    seller: skuItem.seller,
    sellerName: skuItem.sellerName,
  }
}

const BagIcon = () =>(
  <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9924 6.45219C11.9684 6.15131 11.8322 5.87043 11.6108 5.66527C11.3894 5.46012 11.099 5.34566 10.7972 5.34462H10.096V4.24502C10.0897 3.25096 9.69091 2.29965 8.9865 1.59823C8.28209 0.896809 7.3291 0.502082 6.33502 0.5C5.34243 0.502105 4.39109 0.897345 3.68922 1.59922C2.98735 2.30109 2.59211 3.25242 2.59001 4.24502V5.34462H1.87287C1.57104 5.34566 1.28062 5.46012 1.05923 5.66527C0.837838 5.87043 0.701641 6.15131 0.677656 6.45219L0.0481745 15.2171C0.0372941 15.381 0.0600925 15.5454 0.115165 15.7002C0.170238 15.855 0.256419 15.9968 0.368396 16.117C0.480374 16.2372 0.615776 16.3332 0.766261 16.399C0.916746 16.4649 1.07913 16.4993 1.24339 16.5H11.4267C11.5909 16.5005 11.7536 16.467 11.9042 16.4014C12.0549 16.3358 12.1903 16.2397 12.3019 16.1192C12.4135 15.9986 12.4988 15.8561 12.5525 15.7009C12.6062 15.5456 12.6271 15.3809 12.6139 15.2171L11.9924 6.45219ZM6.30315 1.67132C6.98326 1.67324 7.63565 1.941 8.12101 2.41743C8.60637 2.89385 8.8862 3.54116 8.90076 4.22111V5.32072H3.78522V4.22111C3.79359 3.54967 4.06566 2.90844 4.54272 2.43586C5.01977 1.96328 5.66353 1.69726 6.33502 1.69522L6.30315 1.67132ZM1.24339 15.3048L1.87287 6.53984H10.7972L11.4267 15.3048H1.24339Z" fill="white"/>
  </svg>
);
 


function AddToCartButton(props: Props) {
  const {
    text,
    isOneClickBuy,
    available,
    disabled,
    skuItems,
    showToast,
    customToastUrl,
    unavailableText,
    customOneClickBuyLink,
    allSkuVariationsSelected = true,
    productLink,
    onClickBehavior,
    multipleAvailableSKUs,
    customPixelEventId,
    addToCartFeedback,
    onClickEventPropagation = 'disabled',
    isLoading,
  } = props

  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { addItems } = useOrderItems()
  const productContextDispatch = useProductDispatch()
  const { rootPath = '', navigate } = useRuntime()
  const { url: checkoutURL, major } = Utils.useCheckoutURL()
  const { push } = usePixel()
  const { settings = {}, showInstallPrompt = undefined } = usePWA() || {}
  const { promptOnCustomEvent } = settings
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const [isFakeLoading, setFakeLoading] = useState(false)
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  // collect toast and fake loading delay timers
  const timers = useRef<Record<string, number | undefined>>({})

  // prevent timers from doing something if the component was unmounted
  useEffect(function onUnmount() {
    return () => {
      // We disable the eslint rule because we just want to clear the current existing timers
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const currentTimers = timers.current

    if (isFakeLoading) {
      currentTimers.loading = window.setTimeout(
        () => setFakeLoading(false),
        getFakeLoadingDuration(isOneClickBuy)
      )
    }
  }, [isFakeLoading, isOneClickBuy])

  const resolveToastMessage = (success: boolean) => {
    if (!success) return translateMessage(messages.error)

    return translateMessage(messages.success)
  }

  const toastMessage = ({ success }: { success: boolean }) => {
    const message = resolveToastMessage(success)

    const action = success
      ? { label: translateMessage(messages.seeCart), href: customToastUrl }
      : undefined

    showToast({ message, action })
  }

  const handleAddToCart = async () => {
    setFakeLoading(true)

    const productLinkIsValid = Boolean(
      productLink.linkText && productLink.productId
    )
    const shouldNavigateToProductPage =
      onClickBehavior === 'go-to-product-page' ||
      (onClickBehavior === 'ensure-sku-selection' && multipleAvailableSKUs)

    if (productLinkIsValid && shouldNavigateToProductPage) {
      navigate({
        page: 'store.product',
        params: {
          slug: productLink.linkText,
          id: productLink.productId,
        },
      })
      return
    }

    const addItemsPromise = addItems(skuItems, {
      marketingData: { ...utmParams, ...utmiParams },
      ...options,
    })

    const pixelEventItems = skuItems.map(mapSkuItemForPixelEvent)
    const pixelEvent =
      customPixelEventId && addToCartFeedback === 'customEvent'
        ? {
            id: customPixelEventId,
            event: 'addToCart',
            items: pixelEventItems,
          }
        : {
            event: 'addToCart',
            items: pixelEventItems,
          }

    // @ts-expect-error the event is not typed in pixel-manager
    push(pixelEvent)

    if (isOneClickBuy) {
      await addItemsPromise

      if (
        major > 0 &&
        (!customOneClickBuyLink || customOneClickBuyLink === checkoutURL)
      ) {
        navigate({ to: checkoutURL })
      } else {
        window.location.assign(
          `${rootPath}${customOneClickBuyLink ?? checkoutURL}`
        )
      }
    }

    addToCartFeedback === 'toast' &&
      (timers.current.toast = window.setTimeout(() => {
        toastMessage({ success: true })
      }, FAKE_LOADING_DURATION))

    /* PWA */
    if (promptOnCustomEvent === 'addToCart' && showInstallPrompt) {
      showInstallPrompt()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (productContextDispatch) {
      productContextDispatch({
        type: 'SET_BUY_BUTTON_CLICKED',
        args: { clicked: true },
      })
    }

    if (onClickEventPropagation === 'disabled') {
      e.preventDefault()
      e.stopPropagation()
    }

    if (allSkuVariationsSelected) {
      handleAddToCart()
    }
  }

  /*
   * If text is an empty string it should render the default message
   */
  const availableButtonContent = (
    <div className={`${handles.buttonDataContainer} flex justify-center`}>
      {text ? (
        <span className={handles.buttonText}>{text}</span>
      ) : (
        <FormattedMessage id="store/add-to-cart.add-to-cart">
          {message => <span className={handles.buttonText}>{message}</span>}
        </FormattedMessage>
      )}
    </div>
  )

  const unavailableButtonContent = unavailableText ? (
    <span className={handles.buttonText}>{unavailableText}</span>
  ) : (
    <FormattedMessage id="store/add-to-cart.label-unavailable">
      {message => <span className={handles.buttonText}>{message}</span>}
    </FormattedMessage>
  )

  const tooltipLabel = (
    <span className={handles.tooltipLabelText}>
      {intl.formatMessage(messages.skuVariations)}
    </span>
  )

  const ButtonWithLabel = (
    <ContainedButton   
      block
      loading={isFakeLoading || isLoading}
      disabled={disabled || !available}
      onClick={handleClick}
      icon={<BagIcon />}
    >
      {available ? availableButtonContent : unavailableButtonContent}
    </ContainedButton>
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
