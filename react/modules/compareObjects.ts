/* eslint-disable eqeqeq */
export function compareObjects(
  obj1: Record<string, any>,
  obj2: Record<string, any>
) {
  // Loop through properties in object 1
  for (const p in obj1) {
    // Check property exists on both objects
    if (
      Object.prototype.hasOwnProperty.call(obj1, 'p') !==
      Object.prototype.hasOwnProperty.call(obj2, 'p')
    )
      return false

    switch (typeof obj1[p]) {
      // Deep compare objects
      case 'object':
        if (!compareObjects(obj1[p], obj2[p])) return false
        break
      // Compare function code
      case 'function':
        if (
          typeof obj2[p] === 'undefined' ||
          (p != 'compare' && obj1[p].toString() != obj2[p].toString())
        )
          return false
        break
      // Compare values
      default:
        if (obj1[p] != obj2[p]) return false
    }
  }

  // Check object 2 for any extra properties
  for (const p in obj2) {
    if (typeof obj1[p] === 'undefined') return false
  }
  return true
}
