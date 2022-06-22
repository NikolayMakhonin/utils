import {PromiseOrValue} from './contracts'
import {PairingHeap, PairingNode} from '@flemist/pairing-heap'
import {IObjectPool} from 'src/sync/object-pool/contracts'
import {CustomPromise} from 'src/async/custom-promise'
import {Priority, priorityCompare, priorityCreate} from 'src/sync/priority'
import {IAbortSignalFast} from '@flemist/abort-controller-fast'

type TQueueItem<T> = {
  func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>
  abortSignal: IAbortSignalFast
  priority: Priority
  resolve: (value: T) => void
  reject: (error: Error) => void
}

const emptyFunc = () => {}

export function queueItemLessThan(o1: TQueueItem<any>, o2: TQueueItem<any>): boolean {
  return priorityCompare(o1.priority, o2.priority) < 0
}

let nextOrder: number = 1

export class PriorityQueue {
  private readonly _queue: PairingHeap<TQueueItem<any>>

  constructor() {
    this._queue = new PairingHeap<TQueueItem<any>>({
      lessThanFunc: queueItemLessThan,
    })
  }

  run<T>(
    func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>,
    priority?: Priority,
    abortSignal?: IAbortSignalFast,
  ): Promise<T> {
    const promise = new CustomPromise<T>(abortSignal)

    this._queue.add({
      priority: priorityCreate(nextOrder++, priority),
      func,
      abortSignal,
      resolve : promise.resolve,
      reject  : promise.reject,
    })

    this._process()

    return promise.promise
  }

  _processRunning: boolean
  private _process() {
    if (this._processRunning) {
      return
    }
    this._processRunning = true

    const _this = this
    const queue = this._queue
    function next() {
      if (queue.isEmpty) {
        _this._processRunning = false
        return
      }

      const item = queue.deleteMin()
      if (item.abortSignal && item.abortSignal.aborted) {
        item.reject(item.abortSignal.reason)
      }
      else {
        try {
          const result = item.func && item.func(item.abortSignal)
          if (result && typeof result.then === 'function') {
            result
              .then(item.resolve)
              .catch(item.reject)
              .then(next)
            return
          }
          item.resolve(result)
        }
        catch (err) {
          item.reject(err)
        }
      }

      void Promise.resolve().then(emptyFunc).then(next)
    }

    void Promise.resolve().then(emptyFunc).then(next)
  }
}
