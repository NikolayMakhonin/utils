import {PromiseOrValue} from './contracts'
import {PairingHeap, PairingNode} from '@flemist/pairing-heap'
import {IObjectPool} from 'src/sync/object-pool/contracts'
import {CustomPromise} from 'src/async/custom-promise'
import {Priority, priorityCompare} from 'src/sync/priority'
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
      priority,
      func,
      abortSignal,
      resolve: promise.resolve,
      reject : promise.reject,
    })

    void this._process()

    return promise.promise
  }

  _processRunning: boolean
  private async _process() {
    if (this._processRunning) {
      return
    }
    this._processRunning = true

    while (true) {
      await Promise.resolve().then(emptyFunc)

      if (this._queue.isEmpty) {
        break
      }

      const item = this._queue.deleteMin()
      try {
        const result = item.func && await item.func(item.abortSignal)
        item.resolve(result)
      }
      catch (err) {
        item.reject(err)
      }
    }

    this._processRunning = false
  }
}
