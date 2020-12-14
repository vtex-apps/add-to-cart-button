type GroupId = string
type GroupTypes = 'SINGLE' | 'TOGGLE' | 'MULTIPLE'

type InputValue = Record<string, string | boolean>

export interface AssemblyOptions {
  items: Record<GroupId, AssemblyOptionItem[]>
  inputValues: Record<GroupId, InputValue>
  areGroupsValid: Record<string, boolean>
}

export type Option = ItemOption

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

export interface ParsedAssemblyOptionsMeta {
  added: CartAddedOption[]
  removed: CartRemovedOption[]
  parentPrice: number
}

interface ParsedAssemblyOptions {
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

interface TransformAssemblyOptionsArgs {
  assemblyOptionsItems?: Record<GroupId, AssemblyOptionItem[]>
  inputValues?: Record<GroupId, InputValue>
  parentPrice: number
  parentQuantity: number
}

export function sumAssembliesPrice(
  assemblyOptions: Record<GroupId, AssemblyOptionItem[]>
) {
  const cleanAssemblies = assemblyOptions || {}
  const assembliesGroupItems = Object.values(cleanAssemblies)
  return assembliesGroupItems.reduce((sum, groupItems) => {
    const groupPrice = groupItems.reduce((groupSum, item) => {
      const childrenPrice: number = item.children
        ? sumAssembliesPrice(item.children)
        : 0
      const itemCost = item.price * item.quantity
      return groupSum + itemCost + childrenPrice * item.quantity
    }, 0)
    return groupPrice + sum
  }, 0)
}

export function transformAssemblyOptions({
  assemblyOptionsItems = {},
  inputValues = {},
  parentPrice,
  parentQuantity,
}: TransformAssemblyOptionsArgs): ParsedAssemblyOptions {
  // contains options sent as arguments to graphql mutation
  const options: Option[] = []

  // array with added assemblies data to show in minicart optimistic preview
  const added: CartAddedOption[] = []

  // array with removed assemblies data to show in minicart optimistic preview
  const removed: CartRemovedOption[] = []

  let assemblyInputValuesKeys: GroupId[] = Object.keys(inputValues)

  const assemblyItemsKeys: GroupId[] = Object.keys(assemblyOptionsItems)

  for (const groupId of assemblyItemsKeys) {
    const items = assemblyOptionsItems[groupId]
    for (const item of items) {
      let childrenAddedData = null

      if (item.children) {
        const childInputValues: Record<GroupId, InputValue> = {}
        for (const key in item.children) {
          childInputValues[key] = inputValues[key]
        }
        const handledInputValues = Object.keys(childInputValues)
        assemblyInputValuesKeys = assemblyInputValuesKeys.filter(
          inputValueKey => handledInputValues.includes(inputValueKey)
        )

        childrenAddedData = transformAssemblyOptions({
          assemblyOptionsItems: item.children,
          inputValues: childInputValues,
          parentPrice: item.price,
          parentQuantity: item.quantity * parentQuantity,
        })
      }

      const {
        options: childrenOptions,
        assemblyOptions: childrenAssemblyOptions,
      } = childrenAddedData ?? {
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
              item.price + sumAssembliesPrice(item.children ?? {}),
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
