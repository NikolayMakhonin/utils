import {ITimeLimit, PromiseOrValue} from './contracts'
import {CustomPromise} from 'src/async/custom-promise'
import {PriorityQueue} from 'src/async/priority-queue'
import {Priority} from 'src/sync/priority'
import {IAbortSignalFast} from '@flemist/abort-controller-fast'

export class TimeLimits implements ITimeLimit {
  private readonly _timeLimits: ITimeLimit[]
  private readonly _priorityQueue: PriorityQueue

  constructor({
    timeLimits,
    priorityQueue,
  }: {
    timeLimits: ITimeLimit[],
    priorityQueue?: PriorityQueue,
  }) {
    this._timeLimits = timeLimits
    this._priorityQueue = priorityQueue
    this._tickFunc = (abortSignal?: IAbortSignalFast) => this.tick(abortSignal)
  }

  private readonly _tickFunc: () => Promise<void>
  tick(abortSignal?: IAbortSignalFast): Promise<void> {
    return Promise.race(this._timeLimits.map(o => o.tick(abortSignal)))
  }

  available() {
    return this._timeLimits.every(o => o.available())
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

    const waitPromise = new CustomPromise()
    const waitFunc = () => waitPromise.promise
    for (let i = 0; i < this._timeLimits.length; i++) {
      void this._timeLimits[i].run(waitFunc)
    }

    try {
      const result = await func(abortSignal)
      return result
    }
    finally {
      waitPromise.resolve()
    }
  }
}
