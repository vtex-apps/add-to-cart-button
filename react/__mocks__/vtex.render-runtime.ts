import { runtime } from '../__fixtures__/runtime'

export function useRuntime() {
  return {
    ...runtime,
    navigate: jest.fn(),
  }
}
