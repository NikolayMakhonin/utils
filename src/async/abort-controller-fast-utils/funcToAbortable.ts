import {IAbortSignalFast, IUnsubscribe} from '@flemist/abort-controller-fast'
import {CustomPromise} from 'src/async/custom-promise'

export async function funcToAbortable<T>(
  abortSignal: IAbortSignalFast|null,
  func: (abortPromise?: Promise<any>) => Promise<T>|T,
): Promise<T> {
  if (!abortSignal) {
    return func()
  }
  
  if (abortSignal.aborted) {
    return Promise.reject(abortSignal.reason)
  }

  const promise = new CustomPromise<any>()
  function onReject(value: T) {
    promise.reject(value)
  }
  const unsubscribe: IUnsubscribe = abortSignal.subscribe(onReject)
  try {
    return await func(promise.promise)
  }
  finally {
    unsubscribe()
  }
}
