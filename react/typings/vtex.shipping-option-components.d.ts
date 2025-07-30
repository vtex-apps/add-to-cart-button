declare module 'vtex.shipping-option-components'
declare module 'vtex.shipping-option-components/ShippingOptionContext' {
  export type ShippingMethod = 'delivery' | 'pickup-in-point'

  export function useShippingOptionState(): {
    shippingOption?: ShippingMethod
  }
}
