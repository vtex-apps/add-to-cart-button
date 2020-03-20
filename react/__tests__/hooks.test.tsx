import { renderHook, act } from '@vtex/test-tools/react'
import wait from 'waait'

import useMarketingSessionParams from '../hooks/useMarketingSessionParams'
import { mockedRenderSession } from '../__fixtures__/render8Session'
import {
  sessionWithEmptyPublicFields,
  sessionWithOnlyUtmiFields,
  sessionWithOnlyUtmFields,
  sessionWithAllMarketingFields,
} from '../__fixtures__/session'

describe('useMarketingSessionParams', () => {
  const originalWindow = { ...window }
  let windowSpy: jest.SpyInstance

  beforeEach(() => {
    windowSpy = jest.spyOn(global as NodeJS.Global & Window, 'window', 'get')
  })
  afterEach(() => windowSpy.mockRestore())

  it('should return empty utmParams and utmiParams if no publicFields are found in sessionPromise', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      ...mockedRenderSession(sessionWithEmptyPublicFields),
    }))

    const { result } = renderHook(() => useMarketingSessionParams())

    await act(async () => {
      await wait(1)
    })

    expect(result.current).toEqual({ utmParams: {}, utmiParams: {} })
  })

  it('should return empty objects if sessionPromise is nullish', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      ...mockedRenderSession(null),
    }))

    const { result } = renderHook(() => useMarketingSessionParams())

    await act(async () => {
      await wait(1)
    })

    expect(result.current).toEqual({ utmParams: {}, utmiParams: {} })
  })

  it('should return empty strings for utmParams if there are no utm fields', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      ...mockedRenderSession(sessionWithOnlyUtmiFields),
    }))

    const { result } = renderHook(() => useMarketingSessionParams())

    await act(async () => {
      await wait(1)
    })

    expect(result.current).toEqual({
      utmParams: {
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
      },
      utmiParams: {
        utmiCampaign: 'test_utmi_field',
        utmiPage: 'test_utmi_field',
        utmiPart: 'test_utmi_field',
      },
    })
  })

  it('should return empty utmiParams if there are no utmi fields', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      ...mockedRenderSession(sessionWithOnlyUtmFields),
    }))

    const { result } = renderHook(() => useMarketingSessionParams())

    await act(async () => {
      await wait(1)
    })

    expect(result.current).toEqual({
      utmParams: {
        utmSource: 'test_utm_field',
        utmMedium: 'test_utm_field',
        utmCampaign: 'test_utm_field',
      },
      utmiParams: {
        utmiCampaign: '',
        utmiPage: '',
        utmiPart: '',
      },
    })
  })

  it('should correctly return all utm and utmi parameters', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      ...mockedRenderSession(sessionWithAllMarketingFields),
    }))

    const { result } = renderHook(() => useMarketingSessionParams())

    await act(async () => {
      await wait(1)
    })

    expect(result.current).toEqual({
      utmParams: {
        utmSource: 'test_utm_field',
        utmMedium: 'test_utm_field',
        utmCampaign: 'test_utm_field',
      },
      utmiParams: {
        utmiCampaign: 'test_utmi_field',
        utmiPage: 'test_utmi_field',
        utmiPart: 'test_utmi_field',
      },
    })
  })
})
