export function mockedRenderSession(session?: any) {
  return {
    __RENDER_8_SESSION__: {
      sessionPromise: new Promise((resolve, reject) => {
        process.nextTick(() => {
          session || session === null
            ? resolve({ response: session })
            : reject('could not find session info')
        })
      }),
    },
  }
}
