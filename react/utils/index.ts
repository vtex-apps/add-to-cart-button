/* eslint-disable @typescript-eslint/no-use-before-define */
import { path } from 'ramda'

type GroupId = string
type GroupTypes = 'SINGLE' | 'TOGGLE' | 'MULTIPLE'

interface MapCatalogItemToCartArgs {
  product: Maybe<Product>
  selectedItem: Maybe<ProductContextItem>
  selectedQuantity: number
  selectedSeller: any
  assemblyOptions?: {
    items: Record<string, AssemblyOptionItem[]>
    inputValues: Record<string, Record<string, string>>
    areGroupsValid: Record<string, boolean>
  }
}

export interface MapCatalogItemToCartReturn {
  index: 0
  quantity: number
  detailUrl: string
  name: string
  brand: string
  category: string
  productRefId: string
  seller: any
  price: number
  listPrice: number
  variant: string
  skuId: string
  imageUrl: string | undefined
  sellingPriceWithAssemblies: number
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

export function mapCatalogItemToCart({
  product,
  selectedItem,
  selectedQuantity,
  selectedSeller,
  assemblyOptions,
}: MapCatalogItemToCartArgs): MapCatalogItemToCartReturn[] {
  return (
    product &&
    selectedItem &&
    selectedSeller &&
    selectedSeller.commertialOffer && [
      {
        index: 0,
        quantity: selectedQuantity,
        detailUrl: `/${product.linkText}/p`,
        name: product.productName,
        brand: product.brand,
        category:
          product.categories && product.categories.length > 0
            ? product.categories[0]
            : '',
        productRefId: product.productReference,
        seller: selectedSeller.sellerId,
        price: selectedSeller.commertialOffer.Price,
        listPrice: selectedSeller.commertialOffer.ListPrice,
        variant: selectedItem.name,
        skuId: selectedItem.itemId,
        imageUrl: path(['images', '0', 'imageUrl'], selectedItem),
        ...transformAssemblyOptions(
          path(['items'], assemblyOptions),
          path(['inputValues'], assemblyOptions),
          selectedSeller.commertialOffer.Price,
          selectedQuantity
        ),
        sellingPriceWithAssemblies:
          selectedSeller.commertialOffer.Price +
          sumAssembliesPrice(path(['items'], assemblyOptions) || {}),
      },
    ]
  )
}

export function sumAssembliesPrice(
  assemblyOptions: Record<GroupId, AssemblyOptionItem[]>
) {
  const cleanAssemblies = assemblyOptions || {}
  const assembliesGroupItems = Object.values(cleanAssemblies)
  return assembliesGroupItems.reduce<number>(
    (sum: number, groupItems: AssemblyOptionItem[]) => {
      const groupPrice = groupItems.reduce<number>((groupSum, item) => {
        const childrenPrice: number = item.children
          ? sumAssembliesPrice(item.children)
          : 0
        const itemCost = item.price * item.quantity
        return groupSum + itemCost + childrenPrice * item.quantity
      }, 0)
      return groupPrice + sum
    },
    0
  )
}

type InputValue = Record<string, string | boolean>

export interface AssemblyOptions {
  items: Record<GroupId, AssemblyOptionItem[]>
  inputValues: Record<GroupId, InputValue>
  areGroupsValid: Record<string, boolean>
}

type Option = ItemOption

export interface ItemOption {
  assemblyId: string
  id?: string
  quantity?: number
  seller?: string
  options?: Option[]
  inputValues?: InputValue
}

interface AddedItem {
  id: string
  name: string
  quantity: number
  sellingPrice: number
  sellingPriceWithAssemblies: number
  assemblyOptions?: ParsedAssemblyOptionsMeta
}

interface CartAddedOption {
  normalizedQuantity: number
  extraQuantity: number
  choiceType: GroupTypes
  item: AddedItem
}

interface CartRemovedOption {
  name: string
  initialQuantity: number
  removedQuantity: number
}

interface ParsedAssemblyOptionsMeta {
  added: CartAddedOption[]
  removed: CartRemovedOption[]
  parentPrice: number
}

interface ParsedAssemblyOptions {
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

export function transformAssemblyOptions(
  assemblyOptionsItems: Record<GroupId, AssemblyOptionItem[]> = {},
  inputValues: Record<GroupId, InputValue> = {},
  parentPrice: number,
  parentQuantity: number
): ParsedAssemblyOptions {
  // contains options sent as arguments to graphql mutation
  const options: Option[] = []

  // array with added assemblies data to show in minicart optimistic preview
  const added: CartAddedOption[] = []

  // array with removed assemblies data to show in minicart optimistic preview
  const removed: CartRemovedOption[] = []

  const assemblyItemsKeys: GroupId[] = Object.keys(assemblyOptionsItems)

  for (const groupId of assemblyItemsKeys) {
    const items = assemblyOptionsItems[groupId]
    for (const item of items) {
      const childrenAddedData = item.children
        ? transformAssemblyOptions(
            item.children,
            {},
            item.price,
            item.quantity * parentQuantity
          )
        : null

      const {
        options: childrenOptions,
        assemblyOptions: childrenAssemblyOptions,
      } = childrenAddedData || {
        options: undefined,
        assemblyOptions: undefined,
      }

      const { quantity, initialQuantity } = item

      if (quantity >= initialQuantity && quantity > 0) {
        added.push({
          normalizedQuantity: quantity,
          extraQuantity: quantity - initialQuantity,
          choiceType: item.choiceType,
          item: {
            name: item.name,
            sellingPrice: item.price,
            quantity,
            sellingPriceWithAssemblies:
              item.price + sumAssembliesPrice(item.children || {}),
            id: item.id,
            ...(childrenAssemblyOptions
              ? { assemblyOptions: childrenAssemblyOptions }
              : {}),
          },
        })
      }

      if (quantity < initialQuantity && item.choiceType === 'TOGGLE') {
        removed.push({
          name: item.name,
          initialQuantity,
          removedQuantity: initialQuantity - quantity,
        })
      }

      const addedChildrenCount = childrenAddedData
        ? childrenAddedData.options.length
        : 0

      if (quantity !== initialQuantity || addedChildrenCount > 0) {
        options.push({
          assemblyId: groupId,
          id: item.id,
          quantity: quantity * parentQuantity,
          seller: item.seller,
          ...(childrenOptions && childrenOptions.length > 0
            ? { options: childrenOptions }
            : {}),
        })
      }
    }
  }

  const assemblyInputValuesKeys: GroupId[] = Object.keys(inputValues)

  for (const groupId of assemblyInputValuesKeys) {
    const inputValuesObject = inputValues[groupId] || {}
    if (Object.keys(inputValuesObject).length > 0) {
      options.push({
        assemblyId: groupId,
        inputValues: inputValues[groupId],
      })
    }
  }

  return {
    options,
    assemblyOptions: {
      added,
      removed,
      parentPrice,
    },
  }
}
