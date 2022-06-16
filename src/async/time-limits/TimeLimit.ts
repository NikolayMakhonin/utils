import {ITimeLimit, PromiseOrValue} from './contracts'
import {CustomPromise} from 'src/async/custom-promise'
import {PriorityQueue} from 'src/async/priority-queue'
import {Priority} from 'src/sync/priority'
import {IAbortSignalFast} from '@flemist/abort-controller-fast'
import {promiseToAbortable} from 'src/async/abort-controller-fast-utils'

export class TimeLimit implements ITimeLimit {
  private readonly _maxCount: number
  private readonly _timeMs: number
  private readonly _priorityQueue: PriorityQueue
  private readonly _setTimeout: (func: () => void, timeout?: number) => void

  constructor({
    maxCount,
    timeMs,
    priorityQueue,
    setTimeout,
  }: {
    maxCount: number,
    timeMs: number,
    priorityQueue?: PriorityQueue,
    setTimeout?: (func: () => void, timeout?: number) => void,
  }) {
    this._maxCount = maxCount
    this._timeMs = timeMs
    this._priorityQueue = priorityQueue
    this._releaseFunc = () => {
      this._release()
    }
    this._tickFunc = (abortSignal?: IAbortSignalFast) => this.tick(abortSignal)
  }

  private _activeCount: number = 0
  private _tickPromise: CustomPromise<void> = new CustomPromise()

  private readonly _releaseFunc: () => void
  private _release() {
    this._activeCount--
    const tickPromise = this._tickPromise
    this._tickPromise = new CustomPromise()
    tickPromise.resolve()
  }

  private readonly _tickFunc: (abortSignal?: IAbortSignalFast) => Promise<void>
  tick(abortSignal?: IAbortSignalFast): Promise<void> {
    return promiseToAbortable(this._tickPromise.promise, abortSignal)
  }

  available() {
    return this._activeCount < this._maxCount
  }

  async run<T>(
    func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>,
    priority?: Priority,
    abortSignal?: IAbortSignalFast,
  ): Promise<T> {
    if (this._priorityQueue) {
      await this._priorityQueue.run(null, priority, abortSignal)
    }

    while (!this.available()) {
      if (this._priorityQueue) {
        await this._priorityQueue.run(this._tickFunc, priority, abortSignal)
      }
      else {
        await this.tick(abortSignal)
      }
    }

    this._activeCount++
    try {
      const result = await func(abortSignal)
      return result
    }
    finally {
      this._setTimeout(this._releaseFunc, this._timeMs)
    }
  }
}
