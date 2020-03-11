import React from 'react'

export const ToastContext = React.createContext({ showToast: jest.fn() })

export function withToast(Comp: any) {
  return function WrappedWithToast(props: any) {
    return <Comp {...props} showToast={jest.fn()} />
  }
}
