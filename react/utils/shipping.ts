const SHIPPING_INFO_COOKIE = 'shipping_info'

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }

  return undefined
}

const getFacetsData = (facetsDataTarget: string) => {
  let facets = getCookie(SHIPPING_INFO_COOKIE)

  if (!facets) {
    const segment =
      getCookie(SHIPPING_INFO_COOKIE) ??
      (window as any)?.__RUNTIME__.segmentToken

    if (!segment) {
      return
    }

    facets = JSON.parse(atob(segment)).facets
  }

  if (!facets) {
    return
  }

  //  In case the facets came from the shipping_info cookie we must replace ":" by ";" because ";" is not allowed in cookies.
  const facetsTarget = facets
    .replace(/:/g, ';')
    .split(';')
    .find((facet: string) => facet.indexOf(facetsDataTarget) > -1)

  if (!facetsTarget) {
    return
  }

  const [, data] = facetsTarget.split('=')

  if (data && data[data.length - 1] === ';') {
    return data.substring(0, data.length - 1)
  }

  return data
}

export const isShippingSelected = () => {
  return !!getFacetsData('shippingOption')
}
