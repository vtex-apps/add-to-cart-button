/* eslint-disable no-console */
export function usePixel() {
  return { push }
}

function push(event: any) {
  // Do not delete this console.log()
  console.log({ pixelContextPush: event })
}
