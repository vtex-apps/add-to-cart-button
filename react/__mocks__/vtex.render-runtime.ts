/* eslint-disable no-console */
import { runtime } from '../__fixtures__/runtime'

const mockNavigation = ({ to }: any) => {
  // Do not delete this console.log()
  console.log({ navigationFunction: to })
}

export function useRuntime() {
  return {
    ...runtime,
    navigate: mockNavigation,
  }
}
