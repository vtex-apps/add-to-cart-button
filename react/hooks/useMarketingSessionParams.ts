import { useEffect, useState } from 'react'

type PublicSessionField =
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utmi_cp'
  | 'utmi_p'
  | 'utmi_pc'

interface SessionPromiseFieldValue {
  value: string
}

interface UtmParams {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

interface UtmiParams {
  utmiCampaign?: string
  utmiPage?: string
  utmiPart?: string
}

interface SessionPromiseResponse {
  response?: {
    id: string
    namespaces?: {
      account: {
        id: SessionPromiseFieldValue & { keepAlive: boolean }
        accountName: SessionPromiseFieldValue
      }
      store: {
        channel: SessionPromiseFieldValue
        countryCode: SessionPromiseFieldValue
        cultureInfo: SessionPromiseFieldValue
        currencyCode: SessionPromiseFieldValue
        currencySymbol: SessionPromiseFieldValue
        admin_cultureInfo: SessionPromiseFieldValue
      }
      public: Record<PublicSessionField, SessionPromiseFieldValue>
      creditControl: Record<string, SessionPromiseFieldValue>
      authentication: Record<string, any>
      profile: {
        isAuthenticated: SessionPromiseFieldValue
      }
    }
  }
}

const getUtmParams = (
  publicFields: Record<PublicSessionField, SessionPromiseFieldValue>
) => ({
  utmSource: publicFields.utm_source?.value ?? '',
  utmMedium: publicFields.utm_medium?.value ?? '',
  utmCampaign: publicFields.utm_campaign?.value ?? '',
})

const getUtmiParams = (
  publicFields: Record<PublicSessionField, SessionPromiseFieldValue>
) => ({
  utmiPage: publicFields.utmi_p?.value ?? '',
  utmiPart: publicFields.utmi_pc?.value ?? '',
  utmiCampaign: publicFields.utmi_cp?.value ?? '',
})

const getSessionPromiseFromWindow = () => {
  const runtimeSessionPromise = (window as Window & {
    ['__RENDER_8_SESSION__']?: {
      sessionPromise?: Promise<SessionPromiseResponse>
    }
  }).__RENDER_8_SESSION__?.sessionPromise

  return runtimeSessionPromise
}

const useMarketingSessionParams = () => {
  const [utmParams, setUtmParams] = useState<UtmParams>({})
  const [utmiParams, setUtmiParams] = useState<UtmiParams>({})

  useEffect(() => {
    getSessionPromiseFromWindow()
      ?.then(data => {
        const publicFields = data?.response?.namespaces?.public ?? {}
        if (Object.keys(publicFields).length === 0) {
          return
        }

        setUtmParams(
          getUtmParams(
            publicFields as Record<PublicSessionField, SessionPromiseFieldValue>
          )
        )
        setUtmiParams(
          getUtmiParams(
            publicFields as Record<PublicSessionField, SessionPromiseFieldValue>
          )
        )
      })
      .catch(() => {
        // Do nothing
      })
  }, [])

  return { utmParams, utmiParams }
}

export default useMarketingSessionParams
