import React, { createContext, useContext, FC } from 'react'

export const ProductContext = createContext({})

interface Props {
  value: any
}

export const ProductContextProvider: FC<Props> = ({ children, value }) => {
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProduct() {
  return useContext(ProductContext)
}

export function useProductDispatch() {
  return jest.fn()
}
