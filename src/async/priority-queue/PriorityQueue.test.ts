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
      results.push(`${timeController.now() - timeStart}: ${name} start`)
      if (delayTime != null) {
        return delay(delayTime, abortSignal, timeController)
          .then(() => {
            results.push(`${timeController.now() - timeStart}: ${name} end`)
            return name
          })
      }
      results.push(`${timeController.now() - timeStart}: ${name} end`)
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
      results.push(`${timeController.now() - timeStart}: ${funcParams.name} enqueue`)
      const promise = priorityQueue.run(func, priorityCreate(funcParams.order))
      assert.ok(typeof promise.then === 'function')
      const result = await promise
      results.push(`${timeController.now() - timeStart}: ${funcParams.name} result: ${result}`)
    }

    timeController.setTimeout(enqueue, funcParams.delayStart)
  }

  async function awaiter(timeController: TimeControllerMock) {
    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      timeController.addTime(0)
      await 0
    }
  }

  const testVariants = createTestVariants(async ({
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
    const funcsParams: FuncParams[] = [
      {
        name      : 'func1',
        delayStart: delayStart1,
        delayRun  : delayRun1,
        order     : order1,
      },
      {
        name      : 'func2',
        delayStart: delayStart2,
        delayRun  : delayRun2,
        order     : order2,
      },
      {
        name      : 'func3',
        delayStart: delayStart3,
        delayRun  : delayRun3,
        order     : order3,
      },
    ]
    const len = funcsParams.length

    const timeStart = timeController.now()

    for (let i = 0; i < len; i++) {
      const funcParams = funcsParams[i]
      enqueueFunc(results, funcParams, timeController, timeStart, priorityQueue)
    }

    function getExpectedResults() {
      const resultsExpected = []

      const state = []
      for (let i = 0; i < len; i++) {
        state[i] = null
      }

      let time = 0
      let index = 0
      let startedFuncParamsIndex: number
      let startedFuncParamsEndTime: number
      let startedFuncParams: FuncParams

      while (time < 10) {
        for (let i = 0; i < len; i++) {
          const funcParams = funcsParams[i]
          if (state[i] === null) {
            if (time === funcParams.delayStart) {
              resultsExpected[index++] = `${funcParams.delayStart}: ${funcParams.name} enqueue`
              state[i] = 'enqueued'
            }
          }
        }

        if (startedFuncParams && time === startedFuncParamsEndTime) {
          state[startedFuncParamsIndex] = 'completed'
          resultsExpected[index++] = `${time}: ${startedFuncParams.name} end`
          resultsExpected[index++] = `${time}: ${startedFuncParams.name} result: ${startedFuncParams.name}`
          startedFuncParams = null
          startedFuncParamsIndex = null
        }

        if (!startedFuncParams) {
          for (let i = 0; i < len; i++) {
            if (state[i] === 'enqueued') {
              const funcParams = funcsParams[i]
              if (
                !startedFuncParams
                || funcParams.order < startedFuncParams.order
                || funcParams.order === startedFuncParams.order && funcParams.delayStart < startedFuncParams.delayStart
              ) {
                startedFuncParamsIndex = i
                startedFuncParams = funcParams
              }
            }
          }
          if (startedFuncParams) {
            state[startedFuncParamsIndex] = 'started'
            resultsExpected[index++] = `${time}: ${startedFuncParams.name} start`
            startedFuncParamsEndTime = time + (startedFuncParams.delayRun || 0)
          } else {
            time++
          }
        } else {
          time++
        }
      }

      return resultsExpected
    }

    assert.deepStrictEqual(results, [])

    for (let i = 0; i < 20; i++) {
      await awaiter(timeController)
      timeController.addTime(1)
    }

    assert.deepStrictEqual(results, getExpectedResults())
  })

  it('variants', async function () {
    this.timeout(300000)

    await testVariants({
      order1: [0, 1, 2],
      order2: [0, 1, 2],
      order3: [0, 1, 2],

      delayRun1: [null, 1, 2],
      delayRun2: [null, 1, 2],
      delayRun3: [null, 1, 2],

      delayStart1: [0, 1, 2],
      delayStart2: [0, 1, 2],
      delayStart3: [0, 1, 2],
    })()
  })
})
