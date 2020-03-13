/* eslint-disable no-console */
export function useOrderItems() {
  const addItemMock = (skuItems: any, marketingData: any) => {
    // Do not delete this console.log()
    console.log({ addItemMock: { skuItems, marketingData } })
  }

  return { addItem: addItemMock }
}
