import type { ProductTypes } from 'vtex.product-context'

import {
  transformAssemblyOptions,
  sumAssembliesPrice,
  ParsedAssemblyOptionsMeta,
  Option,
} from './assemblyOptions'

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

export interface CartItem {
  detailUrl: string
  id: string
  ean: string
  imageUrl: string
  index?: number
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  seller: string
  sellerName: string
  sellingPrice: number
  productRefId: string
  brand: string
  variant: string
  category: string
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
  sellingPriceWithAssemblies: number
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
  referenceId: Array<{
    Key: string
    Value: string
  }> | null
}

interface MapCatalogItemToCartArgs {
  product?: ProductTypes.ProductContextState['product']
  selectedItem: ProductTypes.ProductContextState['selectedItem']
  selectedQuantity: ProductTypes.ProductContextState['selectedQuantity']
  selectedSeller?: ProductTypes.Seller
  assemblyOptions?: ProductTypes.ProductContextState['assemblyOptions']
}

export function mapCatalogItemToCart({
  product,
  selectedItem,
  selectedQuantity,
  selectedSeller,
  assemblyOptions,
}: MapCatalogItemToCartArgs): CartItem[] {
  if (
    !product ||
    !selectedItem ||
    !selectedSeller ||
    !selectedSeller.commertialOffer
  ) {
    return []
  }

  return [
    {
      index: 0,
      id: selectedItem.itemId,
      ean: selectedItem.ean,
      productId: product.productId ?? '',
      quantity: selectedQuantity,
      uniqueId: '',
      detailUrl: `/${product.linkText}/p`,
      name: product.productName ?? '',
      brand: product.brand ?? '',
      category:
        product.categories && product.categories.length > 0
          ? product.categories[0]
          : '',
      productRefId: product.productReference ?? '',
      seller: selectedSeller.sellerId,
      sellerName: selectedSeller.sellerName,
      variant: selectedItem.name,
      skuName: selectedItem.name,
      price: selectedSeller.commertialOffer.PriceWithoutDiscount * 100,
      listPrice: selectedSeller.commertialOffer.ListPrice * 100,
      sellingPrice: selectedSeller.commertialOffer.Price * 100,
      sellingPriceWithAssemblies:
        ((selectedSeller.commertialOffer.Price as number) +
          sumAssembliesPrice(assemblyOptions?.items ?? {})) *
        100,
      measurementUnit: selectedItem.measurementUnit,
      skuSpecifications: [],
      imageUrl: selectedItem.images[0]?.imageUrl,
      ...transformAssemblyOptions({
        assemblyOptionsItems: assemblyOptions?.items,
        inputValues: assemblyOptions?.inputValues,
        parentPrice: selectedSeller.commertialOffer.Price,
        parentQuantity: selectedQuantity,
      }),
      referenceId: selectedItem.referenceId,
    },
  ]
}
