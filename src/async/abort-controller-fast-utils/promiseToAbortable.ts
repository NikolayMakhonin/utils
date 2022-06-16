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

    promise
      .then(onResolve)
      .catch(reject)

    if (abortSignal) {
      unsubscribe = abortSignal.subscribe(reject)
    }
  })
}
