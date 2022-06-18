import {IAbortSignalFast, IUnsubscribe} from '@flemist/abort-controller-fast'

export function promiseToAbortable<T>(promise: Promise<T>, abortSignal?: IAbortSignalFast): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (abortSignal && abortSignal.aborted) {
      reject(abortSignal.reason)
      return
    }

    let unsubscribe: IUnsubscribe
    function onResolve(value: T) {
      if (unsubscribe) {
        unsubscribe()
      }
      resolve(value)
    }

    let rejected: boolean
    function onReject(value: T) {
      if (rejected) {
        return
      }

      rejected = true

      if (unsubscribe) {
        unsubscribe()
      }

      reject(value)
    }

    promise
      .then(onResolve)
      .catch(onReject)

    if (abortSignal) {
      unsubscribe = abortSignal.subscribe(onReject)
    }
  })
}
