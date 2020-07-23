import { compareObjects } from '../modules/compareObjects'
import { StarColorTop } from '../__fixtures__/productContext'
import {
  customBell,
  comboPizza,
  starColor,
} from '../__fixtures__/assemblyOptions'
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
    it('should transform assemblyOptions', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultBell = transformAssemblyOptions({
        assemblyOptionsItems: customBell.items,
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

    it('input values', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultStar = transformAssemblyOptions({
        assemblyOptionsItems: starColor.items,
        inputValues: starColor.inputValues,
        parentPrice,
        parentQuantity,
      })

      expect(resultStar.options).toHaveLength(1)
      const customization = resultStar.options[0] as ItemOption
      expect(customization.assemblyId).toBe('Customization')
      expect(customization.inputValues).toMatchObject({
        Font: 'Sans serif',
        'Front text': 'Frente',
        'Back text': 'Verso',
        'Glossy print': true,
      })
      expect(resultStar).toMatchInlineSnapshot(`
        Object {
          "assemblyOptions": Object {
            "added": Array [],
            "parentPrice": 450,
            "removed": Array [],
          },
          "options": Array [
            Object {
              "assemblyId": "Customization",
              "inputValues": Object {
                "Back text": "Verso",
                "Font": "Sans serif",
                "Front text": "Frente",
                "Glossy print": true,
              },
            },
          ],
        }
      `)
    })

    it('recursive input values', () => {
      const parentPrice = 450
      const parentQuantity = 1

      const resultBell = transformAssemblyOptions({
        assemblyOptionsItems: customBell.items,
        inputValues: customBell.inputValues,
        parentPrice,
        parentQuantity,
      })

      expect(resultBell.options).toHaveLength(5)

      const engraving = resultBell.options[4] as ItemOption
      expect(engraving.options).toHaveLength(1)

      const recursiveInputValue = engraving.options![0] as ItemOption
      expect(recursiveInputValue.assemblyId).toBe('1-3-lines')
      expect(recursiveInputValue.inputValues).toBe(
        customBell.inputValues['1-3-lines']
      )
      expect(resultBell).toMatchInlineSnapshot(`
        Object {
          "assemblyOptions": Object {
            "added": Array [
              Object {
                "choiceType": "TOGGLE",
                "extraQuantity": 1,
                "item": Object {
                  "id": "2000588",
                  "name": "Bells add-ons Logo small",
                  "quantity": 1,
                  "sellingPrice": 75,
                  "sellingPriceWithAssemblies": 75,
                },
                "normalizedQuantity": 1,
              },
              Object {
                "choiceType": "TOGGLE",
                "extraQuantity": 1,
                "item": Object {
                  "id": "2000589",
                  "name": "Bells add-ons Logo big",
                  "quantity": 1,
                  "sellingPrice": 90,
                  "sellingPriceWithAssemblies": 90,
                },
                "normalizedQuantity": 1,
              },
              Object {
                "choiceType": "SINGLE",
                "extraQuantity": 1,
                "item": Object {
                  "id": "2000592",
                  "name": "Bells add-ons Script",
                  "quantity": 1,
                  "sellingPrice": 15,
                  "sellingPriceWithAssemblies": 15,
                },
                "normalizedQuantity": 1,
              },
              Object {
                "choiceType": "SINGLE",
                "extraQuantity": 1,
                "item": Object {
                  "assemblyOptions": Object {
                    "added": Array [],
                    "parentPrice": 26,
                    "removed": Array [],
                  },
                  "id": "2000586",
                  "name": "Bells add-ons 1-3 lines",
                  "quantity": 1,
                  "sellingPrice": 26,
                  "sellingPriceWithAssemblies": 26,
                },
                "normalizedQuantity": 1,
              },
            ],
            "parentPrice": 450,
            "removed": Array [],
          },
          "options": Array [
            Object {
              "assemblyId": "add-on_Add-on",
              "id": "2000588",
              "quantity": 1,
              "seller": "1",
            },
            Object {
              "assemblyId": "add-on_Add-on",
              "id": "2000589",
              "quantity": 1,
              "seller": "1",
            },
            Object {
              "assemblyId": "text_style_Text Style",
              "id": "2000591",
              "quantity": 0,
              "seller": "1",
            },
            Object {
              "assemblyId": "text_style_Text Style",
              "id": "2000592",
              "quantity": 1,
              "seller": "1",
            },
            Object {
              "assemblyId": "engraving_Engraving",
              "id": "2000586",
              "options": Array [
                Object {
                  "assemblyId": "1-3-lines",
                  "inputValues": Object {
                    "Line 1": "First line",
                    "Line 2": "Second line",
                    "Line 3": "Third line",
                  },
                },
              ],
              "quantity": 1,
              "seller": "1",
            },
          ],
        }
      `)
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
        referenceId: [
          { Key: 'RefId', Value: '987134', __typename: 'Reference' },
        ],
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
