/* eslint-disable jest/no-mocks-import */
import { compareObjects } from '../modules/compareObjects'
import { StarColorTop } from '../__mocks__/productContext'
import { customBell, comboPizza, starColor } from '../__mocks__/assemblyOptions'
import {
  sumAssembliesPrice,
  transformAssemblyOptions,
  ItemOption,
} from '../modules/assemblyOptions'
import { mapCatalogItemToCart } from '../modules/catalogItemToCart'

describe('compareObjects module', () => {
  const obj1 = {
    key1: 'a',
    key2: {
      keyInsideKey: 'a',
      anotherKeyInsideAKey: 'b',
    },
    key3: 'c',
    key4: 'd',
    key5: 'e',
  }

  const obj2 = {
    key1: 'a',
    key2: {
      keyInsideKey: 'a',
      anotherKeyInsideAKey: 'b',
    },
    key3: 'c',
    key4: 'd',
    key5: 'e',
  }

  const obj3 = {
    key1: 'a',
    key2: {
      keyInsideKey: 'something different',
      anotherKeyInsideAKey: 'something different',
    },
    key3: 'c',
    key4: 'd',
    key5: 'e',
  }

  const obj4 = {
    key1: 'a',
    key2: 'a',
  }

  it('should return true for distinct objects with the same keys and values', () => {
    expect(compareObjects(obj1, obj2)).toBeTruthy()
  })
  it('should return true for the exact same object', () => {
    expect(compareObjects(obj1, obj1)).toBeTruthy()
  })
  it('should return false for objects with same keys but different values', () => {
    expect(compareObjects(obj1, obj3)).toBeFalsy()
  })
  it('should return false for objects with different keys', () => {
    expect(compareObjects(obj1, obj4)).toBeFalsy()
  })
})

describe('assemblyOptions module', () => {
  describe('sumAssembliesPrice function', () => {
    it('should return the correct total price for a set of assembly items', () => {
      const totalPriceFromCustomBellAssemblies = 75 + 90 + 15 + 26
      expect(sumAssembliesPrice(customBell.items as any)).toBe(
        totalPriceFromCustomBellAssemblies
      )
    })
    it('should return 0 if there are no assemblies for item', () => {
      expect(sumAssembliesPrice(starColor.items)).toBe(0)
    })
  })

  describe('transformAssemblyOptions function', () => {
    it('should correctly transform full assembly options', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultBell = transformAssemblyOptions({
        assemblyOptionsItems: customBell.items as any,
        inputValues: {},
        parentPrice,
        parentQuantity,
      })

      expect(resultBell.options).toHaveLength(5)

      const addonOption = resultBell.options[0] as ItemOption
      expect(addonOption.assemblyId).toBe('add-on_Add-on')
      expect(addonOption.id).toBe('2000588')
      expect(addonOption.quantity).toBe(1)
      expect(addonOption.seller).toBe('1')

      const resultPizza = transformAssemblyOptions({
        assemblyOptionsItems: comboPizza.items,
        inputValues: {},
        parentPrice,
        parentQuantity,
      })

      expect(resultPizza.options).toHaveLength(2)

      const pizzaOption = resultPizza.options[0] as ItemOption
      expect(pizzaOption.assemblyId).toBe('pizza_composition_Pizza flavor')
      expect(pizzaOption.id).toBe('5101')
      expect(pizzaOption.quantity).toBe(1)
      expect(pizzaOption.seller).toBe('1')
      expect(pizzaOption.options).toHaveLength(3)

      const drinksOptions = resultPizza.options[1] as ItemOption
      expect(drinksOptions.options).toBeUndefined()
    })

    it('should correctly transform assembly options with input values', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultStar = transformAssemblyOptions({
        assemblyOptionsItems: starColor.items,
        inputValues: starColor.inputValues,
        parentPrice,
        parentQuantity,
      })

      expect(resultStar.options).toHaveLength(1)

      const [customization] = resultStar.options
      expect(customization.assemblyId).toBe('Customization')
      expect(customization.inputValues).toMatchObject({
        Font: 'Sans serif',
        'Front text': 'Frente',
        'Back text': 'Verso',
        'Glossy print': true,
      })
    })

    it('empty input values should result in empty options', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultStar = transformAssemblyOptions({
        assemblyOptionsItems: starColor.items,
        inputValues: {
          Customization: {},
        },
        parentPrice,
        parentQuantity,
      })
      expect(resultStar.options).toHaveLength(0)
    })
  })
})

describe('catalogToCart module', () => {
  it('should return [] if there are missing arguments', () => {
    expect(mapCatalogItemToCart({} as any)).toStrictEqual([])
  })
  it('should return expected skuItem for the minicart', () => {
    const { product } = StarColorTop
    const { selectedItem } = StarColorTop
    const { assemblyOptions } = StarColorTop
    const [selectedSeller] = StarColorTop.selectedItem.sellers
    const selectedQuantity =
      StarColorTop.selectedQuantity != null ? StarColorTop.selectedQuantity : 1

    const expectedOutput = [
      {
        index: 0,
        id: '2000564',
        productId: '2000024',
        quantity: 1,
        uniqueId: '',
        detailUrl: '/star-color-top/p',
        name: 'Top Star Color Shirt',
        brand: 'Kawasaki',
        category: '/Apparel & Accessories/Clothing/Tops/',
        productRefId: '998765',
        seller: '1',
        variant: 'Red star',
        skuName: 'Red star',
        price: 3500,
        listPrice: 3500,
        sellingPrice: 3500,
        sellingPriceWithAssemblies: 3500,
        measurementUnit: 'un',
        skuSpecifications: [],
        imageUrl:
          'https://storecomponents.vtexassets.com/arquivos/ids/155518/download--40-.png?v=636942495289870000',
        options: [],
        assemblyOptions: {
          added: [],
          parentPrice: 35,
          removed: [],
        },
      },
    ]

    expect(
      mapCatalogItemToCart({
        product: product as any,
        selectedItem,
        selectedQuantity,
        selectedSeller,
        assemblyOptions,
      })
    ).toStrictEqual(expectedOutput)
  })
})
