import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { firebaseApp } from './config'

export const functions = getFunctions(firebaseApp, 'asia-south1')

// Uncomment for local emulator dev:
// if (import.meta.env.DEV) {
//   connectFunctionsEmulator(functions, 'localhost', 5001)
// }

export { httpsCallable }

// Typed callable helpers
export const callFunction = <TData, TResult>(name: string) =>
  httpsCallable<TData, TResult>(functions, name)
