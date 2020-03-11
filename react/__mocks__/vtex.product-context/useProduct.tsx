import { useContext } from 'react'

import { ProductContext } from './ProductContextProvider'

export default function useProduct() {
  return useContext(ProductContext)
}
