/* eslint-disable no-loop-func */

import {TimeLimit} from './TimeLimit'
import {TimeLimits} from './TimeLimits'
import {delay} from 'src/async/delay'
import {PriorityQueue} from 'src/async/priority-queue'
import {priorityCreate} from 'src/sync/priority'

describe('time-limits > TimeLimits', function () {
  this.timeout(300000)
  type Mode = 'sync' | 'async' | 'random'

  async function test({
    maxCount,
    timeMs,
    asyncTime,
    mode,
    withPriorityQueue,
    timeLimitsTree,
  }: {
    maxCount: number,
    timeMs: number,
    asyncTime: number,
    mode: Mode,
    withPriorityQueue?: boolean,
    timeLimitsTree?: boolean,
  }) {
    try {
      const priorityQueue = withPriorityQueue ? new PriorityQueue() : null
      const timeLimit = timeLimitsTree
        ? new TimeLimits({
          priorityQueue,
          timeLimits: [
            new TimeLimit({maxCount, timeMs, priorityQueue}),
            new TimeLimits({
              priorityQueue,
              timeLimits: [
                new TimeLimits({
                  priorityQueue,
                  timeLimits: [
                    new TimeLimit({maxCount, timeMs, priorityQueue}),
                    new TimeLimit({maxCount, timeMs, priorityQueue}),
                  ],
                }),
                new TimeLimit({maxCount, timeMs, priorityQueue}),
              ],
            }),
          ],
        })
        : new TimeLimit({maxCount, timeMs, priorityQueue})

      let completedCount = 0

      const run = function run(result: number, delayMs: number) {
        if (delayMs) {
          return delay(delayMs).then(() => {
            completedCount++
            return result
          })
        }
        completedCount++
        return result
      }

      assert.strictEqual(completedCount, 0)
      const promises = []
      const results = []
      for (let i = 0, len = maxCount * 3; i < len; i++) {
        const index = i
        const order = len - 1 - i
        const async = mode === 'async' || mode === 'random' && Math.random() > 0.5
        const result = timeLimit.run(() => run(index, async ? asyncTime : 0), priorityCreate(order))
        assert.ok(typeof result.then === 'function')
        promises.push(result.then(o => {
          assert.strictEqual(o, index)
          results.push(order)
        }))
      }

      await delay(50)

      if (mode === 'async' || mode === 'random') {
        await delay(asyncTime)
      }
      assert.strictEqual(completedCount, maxCount)

      await delay(timeMs + asyncTime * 3)
      assert.strictEqual(completedCount, maxCount * 2)

      await delay(timeMs + asyncTime * 3)
      assert.strictEqual(completedCount, maxCount * 3)

      await delay(timeMs + asyncTime * 3)
      assert.strictEqual(completedCount, maxCount * 3)

      await Promise.all(promises)

      if (priorityQueue && (mode !== 'random' || maxCount > 5)) {
        assert.ok(results.every((o, i) => o === i) === (mode !== 'random'), results.join(', '))
      }
    }
    catch (err) {
      console.log(JSON.stringify({
        maxCount,
        timeMs,
        asyncTime,
        mode,
        withPriorityQueue,
        timeLimitsTree,
      }, null, 2))
      throw err
    }
  }

  it('custom', async function () {
    await test({
      maxCount         : 10,
      timeMs           : 1000,
      asyncTime        : 500,
      mode             : 'async',
      withPriorityQueue: false,
      timeLimitsTree   : true,
    })
  })

  it('combinations', async function () {
    const modes: Mode[] = ['sync', 'async', 'random']
    const maxCounts = [1, 10]
    const withPriorityQueues = [false, true]
    const timeLimitsTrees = [false, true]
    for (const withPriorityQueue of withPriorityQueues) {
      for (const mode of modes) {
        for (const maxCount of maxCounts) {
          for (const timeLimitsTree of timeLimitsTrees) {
            await test({
              maxCount,
              timeMs   : 1000,
              asyncTime: mode === 'async' ? 500
                : mode === 'random' ? 200
                  : 0,
              mode,
              withPriorityQueue,
              timeLimitsTree,
            })
          }
        }
      }
    }
  })
})
