import {PriorityQueue} from './PriorityQueue'
import {priorityCreate} from 'src/sync/priority'
import {createTestVariants} from '@flemist/test-variants'
import {IAbortSignalFast} from '@flemist/abort-controller-fast'
import {ITimeController, TimeControllerMock} from '@flemist/time-controller'
import {delay} from '~/src'

describe('priority-queue > PriorityQueue', function () {
  it('base', async function () {
    const queue = new PriorityQueue()
    const log = []

    let whileCount = 0
    async function test(index: number, order: number) {
      do {
        log.push('run' + index)
        // console.log('run' + index)
        await queue.run(() => {
          log.push('tick' + index)
          // console.log('tick' + index)
        }, priorityCreate(order))
        log.push('check' + index)
        // console.log('check' + index)
      } while ((whileCount++) % 2 === 0)

      log.push('end' + index)
      // console.log('end' + index)
    }

    const promises = []
    const count = 10
    for (let i = 0; i < count; i++) {
      promises.push(test(i, count - 1 - i))
    }

    await Promise.all(promises)

    for (let i = 0; i < count; i++) {
      assert.strictEqual(log[i], 'run' + i)
    }

    let prevIndex = count - 1
    for (let i = count; i < log.length; i++) {
      const index = parseInt(log[i].match(/\d+/), 10)
      assert.ok(index === prevIndex || index === prevIndex - 1)
      prevIndex = index
      // console.log(index)
    }

    console.log(log.join('\r\n'))
  })
  
  type FuncParams = {
    name: string,
    delayStart: number,
    delayRun: number,
    order: number,
  }

  function createFunc(
    name: string,
    results: string[],
    delayTime: number,
    timeController: ITimeController,
    timeStart: number,
  ) {
    return function func(abortSignal?: IAbortSignalFast) {
      results.push(`${name} start (${timeController.now() - timeStart})`)
      if (delayTime != null) {
        return delay(delayTime, abortSignal)
          .then(() => {
            results.push(`${name}: end (${timeController.now() - timeStart})`)
            return name
          })
      }
      results.push(`${name}: end (${timeController.now() - timeStart})`)
      return name
    }
  }
  
  function enqueueFunc(
    results: string[],
    funcParams: FuncParams,
    timeController: ITimeController,
    timeStart: number,
    priorityQueue: PriorityQueue,
  ) {
    const func = createFunc(funcParams.name, results, funcParams.delayRun, timeController, timeStart)
    
    async function enqueue() {
      results.push(`${funcParams.name} enqueue (${timeController.now() - timeStart})`)
      const promise = priorityQueue.run(func, priorityCreate(funcParams.order))
      assert.ok(typeof promise.then === 'function')
      const result = await promise
      results.push(`${funcParams.name} result: ${result} (${timeController.now() - timeStart})`)
    }

    timeController.setTimeout(enqueue, funcParams.delayStart)
  }

  const funcsParams: FuncParams[] = [
    {
      name      : 'func1',
      delayStart: 0,
      delayRun  : 0,
      order     : 0,
    },
    {
      name      : 'func2',
      delayStart: 0,
      delayRun  : 0,
      order     : 0,
    },
    {
      name      : 'func3',
      delayStart: 0,
      delayRun  : 0,
      order     : 0,
    },
  ]

  const testVariants = createTestVariants(({
    delayRun1,
    delayRun2,
    delayRun3,

    delayStart1,
    delayStart2,
    delayStart3,

    order1,
    order2,
    order3,
  }: {
    delayRun1: number,
    delayRun2: number,
    delayRun3: number,

    delayStart1: number,
    delayStart2: number,
    delayStart3: number,

    order1: number,
    order2: number,
    order3: number,
  }) => {
    const results = []
    const timeController = new TimeControllerMock()
    const priorityQueue = new PriorityQueue()
    funcsParams[0].delayStart = delayStart1
    funcsParams[1].delayStart = delayStart2
    funcsParams[2].delayStart = delayStart3
    funcsParams[0].delayRun = delayRun1
    funcsParams[1].delayRun = delayRun2
    funcsParams[2].delayRun = delayRun3
    funcsParams[0].order = order1
    funcsParams[1].order = order2
    funcsParams[2].order = order3

    const timeStart = timeController.now()

    funcsParams.forEach(funcParams => {
      enqueueFunc(results, funcParams, timeController, timeStart, priorityQueue)
    })

    const checkResults = []
    function getCheckResults() {
      const time = timeController.now() - timeStart
      let index = 0
      funcsParams.forEach(funcParams => {
        if (time >= funcParams.delayStart) {
          checkResults[index++] = `${funcParams.name} enqueue (${funcParams.delayStart})`
        }
      })
      checkResults.length = index
      return checkResults
    }

    timeController.addTime(0)
    assert.deepStrictEqual(results, getCheckResults())
  })

  it('variants', async function () {
    this.timeout(300000)

    await testVariants({
      delayRun1: [null, 0, 1, 2],
      delayRun2: [null, 0, 1, 2],
      delayRun3: [null, 0, 1, 2],

      delayStart1: [0, 1, 2],
      delayStart2: [0, 1, 2],
      delayStart3: [0, 1, 2],

      order1: [null, 0, 1, 2],
      order2: [null, 0, 1, 2],
      order3: [null, 0, 1, 2],
    })()
  })
})
