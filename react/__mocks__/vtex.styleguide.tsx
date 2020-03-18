/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'

export const ToastContext = React.createContext({ showToast: jest.fn() })

export function withToast(Comp: any) {
  return function WrappedWithToast(props: any) {
    return <Comp {...props} showToast={jest.fn()} />
  }
}

export const Tooltip: FC<{ label: string }> = ({ label, children }) => (
  <div data-testid="Tooltip">
    {label}
    {children}
  </div>
)

export const Button: FC = ({ children, onClick }: any) => (
  <button onClick={onClick} data-testid="styleguide-button">
    {children}
  </button>
)
