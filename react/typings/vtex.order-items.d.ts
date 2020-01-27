declare module 'vtex.order-items/OrderItems' {
  import { OrderItems } from 'vtex.order-items'

  export const useOrderItems = OrderItems.useOrderItems

  export const OrderItemsProvider = OrderItems.OrderItemsProvider
}
