import {IAbortSignalFast, IUnsubscribe} from '@flemist/abort-controller-fast'

export function delay(milliseconds: number, abortSignal?: IAbortSignalFast) {
  return new Promise<void>((resolve, reject) => {
    if (abortSignal && abortSignal.aborted) {
      reject(abortSignal.reason)
      return
    }

    let unsubscribe: IUnsubscribe
    function onResolve() {
      if (unsubscribe) {
        unsubscribe()
      }
      resolve()
    }

    const timer = setTimeout(onResolve, milliseconds)

    if (abortSignal) {
      unsubscribe = abortSignal.subscribe((reason) => {
        clearTimeout(timer)
        reject(reason)
      })
    }
  })
}
