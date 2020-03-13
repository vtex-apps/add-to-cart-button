/* eslint-disable no-console */
export function useProductDispatch() {
  const mockDispatch = (args: any) => {
    // Do not delete this console.log()
    console.log({ mockDispatchArgs: args })
  }

  return mockDispatch
}
