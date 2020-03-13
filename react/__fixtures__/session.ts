export const sessionWithEmptyPublicFields = {
  id: '1a2b3c4d-a12b-12a3-123a-ab123cd4efg5',
  namespaces: {
    account: {
      id: {
        value: '1a2b3c4d-a12b-12a3-123a-ab123cd4efg5',
        keepAlive: true,
      },
      accountName: {
        value: 'storecomponents',
      },
    },
    store: {
      channel: {
        value: '1',
      },
      countryCode: {
        value: 'USA',
      },
      cultureInfo: {
        value: 'en-US',
      },
      currencyCode: {
        value: 'USD',
      },
      currencySymbol: {
        value: '$',
      },
      admin_cultureInfo: {
        value: 'en-US',
      },
    },
    public: {},
    creditControl: {
      creditAccounts: {
        value: {
          accounts: [],
        },
      },
      deadlines: {
        value: {
          deadlines: [],
        },
      },
      minimumInstallmentValue: {
        value: 0,
      },
    },
    authentication: {},
    profile: {
      isAuthenticated: {
        value: 'false',
      },
    },
  },
}

export const sessionWithOnlyUtmiFields = {
  ...sessionWithEmptyPublicFields,
  namespaces: {
    ...sessionWithEmptyPublicFields.namespaces,
    public: {
      utmi_cp: { value: 'test_utmi_field' },
      utmi_p: { value: 'test_utmi_field' },
      utmi_pc: { value: 'test_utmi_field' },
    },
  },
}

export const sessionWithOnlyUtmFields = {
  ...sessionWithEmptyPublicFields,
  namespaces: {
    ...sessionWithEmptyPublicFields.namespaces,
    public: {
      utm_source: { value: 'test_utm_field' },
      utm_medium: { value: 'test_utm_field' },
      utm_campaign: { value: 'test_utm_field' },
    },
  },
}

export const sessionWithAllMarketingFields = {
  ...sessionWithEmptyPublicFields,
  namespaces: {
    ...sessionWithEmptyPublicFields.namespaces,
    public: {
      utm_source: { value: 'test_utm_field' },
      utm_medium: { value: 'test_utm_field' },
      utm_campaign: { value: 'test_utm_field' },
      utmi_cp: { value: 'test_utmi_field' },
      utmi_p: { value: 'test_utmi_field' },
      utmi_pc: { value: 'test_utmi_field' },
    },
  },
}
