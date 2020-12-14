import React, { createContext, FC } from 'react'

export const ProductContext = createContext({})

interface Props {
  value: any
}

export const ProductContextProvider: FC<Props> = ({ children, value }) => {
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}
