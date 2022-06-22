import {IAbortSignalFast} from '@flemist/abort-controller-fast'

const emptyFunc = function emptyFunc() {}

export class CustomPromise<TResult> {
  readonly promise: Promise<TResult>
  readonly resolve: (result?: TResult) => void
  readonly reject: (error?: any) => void

  constructor(abortSignal?: IAbortSignalFast) {
    if (abortSignal && abortSignal.aborted) {
      this.promise = Promise.reject(abortSignal.reason)
      this.resolve = emptyFunc
      this.reject = emptyFunc
    }
    else {
      let resolve: (result: TResult) => void
      let reject: (error: any) => void
      this.promise = new Promise<TResult>(function executor(_resolve, _reject) {
        resolve = _resolve
        reject = _reject
      })

      if (abortSignal) {
        const unsubscribe = abortSignal.subscribe(function abortListener(reason) {
          reject(reason)
        })
        this.resolve = function _resolve(result) {
          unsubscribe()
          resolve(result)
        }
        this.reject = function _reject(error) {
          unsubscribe()
          reject(error)
        }
      }
      else {
        this.resolve = resolve
        this.reject = reject
      }
    }
  }
}
