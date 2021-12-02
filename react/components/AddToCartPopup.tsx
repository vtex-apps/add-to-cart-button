import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import ReactDOM from 'react-dom'
import { FormattedMessage } from 'react-intl'

import styles from '../styles/AddToCartPopup.css'
import { CartItem } from '../modules/catalogItemToCart'

interface Props {
  skuItems: CartItem[]
  setshowPopup: Function
}

function AddToCartPopup(props: Props) {
  const { skuItems, setshowPopup } = props

  const { orderForm } = useOrderForm()
  const { url } = useCheckoutURL()

  const referenceElement = document.body

  const closePopup = (e: any) => {
    e.stopPropagation()
    setshowPopup(false)
  }

  return (
    <div>
      {ReactDOM.createPortal(
        <div className={styles.ATCPopupWrapper}>
          <div className={styles.ATCPopup}>
            <div className={`${styles.ATCPopupHeader}`}>
              <FormattedMessage id="store/add-to-cart.add-to-cart">
                {message => (
                  <h2 className={`f2 ${styles.ATCPopupHeaderTitle}`}>
                    {message}
                  </h2>
                )}
              </FormattedMessage>
              <span
                className={styles.ATCPopupClose}
                role="button"
                tabIndex={-1}
                onKeyDown={closePopup}
                onClick={closePopup}
              />
            </div>
            <div className={styles.ATCPopupBody}>
              <div className={`${styles.ATCPopupProductInfo} fl w-100 w-70-ns`}>
                <div
                  className={`${styles.ATCPopupProductImageContainer} fl w-100 w-50-ns`}
                >
                  <img
                    src={skuItems ? skuItems[0].imageUrl : ''}
                    className={`${styles.ATCPopupProductImage}`}
                    alt={`${skuItems ? skuItems[0].name : ''}`}
                  />
                </div>
                <div className={`${styles.ATCPopupCartText} fl w-100 w-50-ns`}>
                  <h3 className={`${styles.ATCPopupProductName} f3`}>
                    {skuItems ? skuItems[0].name : ''}
                  </h3>
                  <div className={styles.ATCPopupProductDetails}>
                    <p>$ {skuItems ? skuItems[0].sellingPrice / 100 : ''}</p>
                    <p> {skuItems ? skuItems[0].skuName : ''}</p>
                    <FormattedMessage id="store/add-to-cart.quantity">
                      {message => (
                        <p>
                          {message}: {skuItems ? skuItems[0].quantity : ''}
                        </p>
                      )}
                    </FormattedMessage>
                  </div>
                </div>
              </div>
              <div className={`${styles.ATCPopupCartInfo} fl w-100 w-30-ns`}>
                <FormattedMessage id="store/add-to-cart.your-cart">
                  {message => (
                    <h3 className={`${styles.ATCPopupCartInfoTitle} w-100 f3`}>
                      {message}
                    </h3>
                  )}
                </FormattedMessage>
                <div className={`${styles.ATCPopupTotalizers} w-100 w-50-ns`}>
                  <FormattedMessage id="store/add-to-cart.items">
                    {message => (
                      <p className="w-100">
                        {orderForm.items.length} {message}
                      </p>
                    )}
                  </FormattedMessage>
                  <FormattedMessage id="store/add-to-cart.subtotal">
                    {message => <p className="w-100">{message}</p>}
                  </FormattedMessage>
                </div>
                <div className={`${styles.ATCPopupTotalizers} w-100 w-50-ns`}>
                  <p>$ {orderForm.value / 100}</p>
                </div>
                <p className={`${styles.ATCPopupTotal} w-100 f3`}>
                  <FormattedMessage id="store/add-to-cart.total">
                    {message => <span>{message}</span>}
                  </FormattedMessage>
                  ${orderForm.value / 100}
                </p>
                <FormattedMessage id="store/add-to-cart.continue-shopping">
                  {message => (
                    <a
                      href="/"
                      className={`${styles.ATCPopupContinueButton} w-100 `}
                    >
                      {message}
                    </a>
                  )}
                </FormattedMessage>
                <FormattedMessage id="store/add-to-cart.go-to-checkout">
                  {message => (
                    <a
                      href={url}
                      className={`${styles.ATCPopupViewCart} w-100 `}
                    >
                      {message}
                    </a>
                  )}
                </FormattedMessage>
              </div>
            </div>
          </div>
        </div>,
        referenceElement
      )}
    </div>
  )
}

export default AddToCartPopup
