/* eslint-disable import/order, import/no-duplicates */

declare module 'vtex.order-manager/OrderForm' {
  import { OrderForm } from 'vtex.order-manager'

  export const useOrderForm = OrderForm.useOrderForm

  export const OrderFormProvider = OrderForm.OrderFormProvider
}

declare module 'vtex.order-manager/OrderQueue' {
  import { OrderQueue } from 'vtex.order-manager'

  export const useOrderQueue = OrderQueue.useOrderQueue

  export const QueueStatus = OrderQueue.QueueStatus

  export const useQueueStatus = OrderQueue.useQueueStatus
}
