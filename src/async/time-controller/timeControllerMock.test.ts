import {createTestVariants, createTestVariantsSync} from '@flemist/test-variants'
import {TimeControllerMock} from './timeControllerMock'
import {ITimeController} from './contracts'
import {timeControllerDefault} from './timeControllerDefault'
import {delay} from '../delay'

describe('time-controller > timeControllerMock', function () {
  this.timeout(60000000)
  function test({
    timeController,
    times,
    postDelay,
    resolve,
  }: {
    timeController: ITimeController,
    times: {index: number, start: number|null, timeout: number, abort: number|null}[],
    postDelay: number,
    resolve: (result: string[]) => void,
  }) {
    const result: string[] = []
    let timeMax = 0
    for (let i = 0, len = times.length; i < len; i++) {
      const time = times[i]
      timeMax = Math.max(timeMax, (time.start || 0) + Math.max(time.timeout || 0, time.abort || 0))

      const start = () => {
        const handle = timeController.setTimeout(() => {
          result.push(`completed: ${time.index}`)
        }, time.timeout)

        if (time.abort != null) {
          if (time.abort < 0) {
            timeController.clearTimeout(handle)
          }
          else {
            timeController.setTimeout(() => {
              timeController.clearTimeout(handle)
              result.push(`aborted: ${time.index}`)
            }, time.abort)
          }
        }
      }

      if (time.start == null) {
        start()
      }
      else {
        timeController.setTimeout(start, time.start)
      }
    }

    timeController.setTimeout(() => {
      resolve(result)
    }, timeMax + postDelay)

    return timeMax + postDelay
  }

  const _testVariants = createTestVariantsSync(({
    times,
    step1,
    step2,
    step3,
    expectedResult,
  }: {
    times: {index: number, start: number|null, timeout: number, abort: number|null}[],
    step1: number,
    step2: number,
    step3: number,
    expectedResult: string[],
  }) => {
    const steps = [step1, step2, step3].filter(o => o != null)
    
    const timeController = new TimeControllerMock()
    
    let result: string[]
    let expectedTime = test({
      timeController,
      times,
      postDelay: 0,
      resolve  : o => {
        result = o
      },
    })
    
    for (let i = 0, len = steps.length; i < len; i++) {
      const step = steps[i]
      expectedTime -= step
      timeController.addTime(step)
    }
    timeController.addTime(expectedTime)
    
    // console.log(result)
    assert.deepStrictEqual(result, expectedResult)
  })
    
  const testVariants = createTestVariants(async ({
    time1Start,
    time1Timeout,
    time1Abort,
    time2Start,
    time2Timeout,
    time2Abort,
    time3Start,
    time3Timeout,
    time3Abort,
  }: {
    time1Start: number|null,
    time1Timeout: number|null,
    time1Abort: number|null,
    time2Start: number|null,
    time2Timeout: number|null,
    time2Abort: number|null,
    time3Start: number|null,
    time3Timeout: number|null,
    time3Abort: number|null,
  }) => {
    const times: {index: number, start: number|null, timeout: number, abort: number|null}[] = [
      [time1Start, time1Timeout, time1Abort],
      [time2Start, time2Timeout, time2Abort],
      [time3Start, time3Timeout, time3Abort],
    ]
      .filter(o => o[1] != null)
      .map(([start, timeout, abort], index) => {
        return {
          index,
          start,
          timeout,
          abort,
        }
      })

    if (times.length === 0) {
      return
    }

    const events = []
    times.forEach(time => {
      if (time.abort != null && time.abort < 0) {
        return
      }
      if (time.abort == null || time.abort >= time.timeout) {
        events.push({
          time : (time.start || 0) + (time.timeout || 0),
          start: time.start,
          index: time.index * 2,
          event: `completed: ${time.index}`,
        })
      }
      if (time.abort != null) {
        events.push({
          time : (time.start || 0) + (time.abort || 0),
          start: time.start,
          index: time.index * 2 + 1,
          event: `aborted: ${time.index}`,
        })
      }
    })
    events.sort((o1, o2) => {
      if (o1.time !== o2.time) {
        return o1.time > o2.time || o1.time !== null && o2.time === null ? 1 : -1
      }
      if (o1.start !== o2.start) {
        return o1.start > o2.start || o1.start !== null && o2.start === null ? 1 : -1
      }
      if (o1.index !== o2.index) {
        return o1.index > o2.index ? 1 : -1
      }
      throw new Error('Unexpected behavior')
    })
    const _expectedResult = events.map(o => o.event)

    const expectedResult = await new Promise<string[]>((resolve, reject) => {
      test({
        timeController: timeControllerDefault,
        times,
        postDelay     : 300,
        resolve,
      })
    })

    _testVariants({
      times         : [times],
      step1         : [null],
      step2         : [null],
      step3         : [null],
      expectedResult: [expectedResult],
    })

    assert.deepStrictEqual(_expectedResult, expectedResult)
  })

  it('setTimeout order', async function () {
    const result: number[] = []
    for (let i = 0; i < 100; i++) {
      setTimeout(() => result.push(4), 3)
      setTimeout(() => result.push(5), 3)
      setTimeout(() => result.push(6), 3)
      setTimeout(() => result.push(1), 0)
      setTimeout(() => result.push(2), 0)
      setTimeout(() => result.push(3), 0)
      await delay(10)
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6])
      result.length = 0
    }
  })

  xit('custom 1', async function () {
    await testVariants({
      time1Start  : [0],
      time1Timeout: [0],
      time1Abort  : [null],
      time2Start  : [null],
      time2Timeout: [4],
      time2Abort  : [null],
      time3Start  : [null],
      time3Timeout: [null],
      time3Abort  : [null],
    })
  })

  it('custom 2', async function () {
    await testVariants({
      time3Start  : [null],
      time3Timeout: [null],
      time3Abort  : [null],
      time2Start  : [null],
      time2Timeout: [0],
      time2Abort  : [50],
      time1Start  : [0],
      time1Timeout: [0],
      time1Abort  : [null],
    })
  })

  it('base', async function () {
    await testVariants({
      time3Start  : [null, 0, 50, 100],
      time3Timeout: [null, 0, 50, 100],
      time3Abort  : [null, -1, 0, 50, 100],
      time2Start  : [null, 0, 50, 100],
      time2Timeout: [null, 0, 50, 100],
      time2Abort  : [null, -1, 0, 50, 100],
      time1Start  : [null, 0, 50, 100],
      time1Timeout: [null, 0, 50, 100],
      time1Abort  : [null, -1, 0, 50, 100],
    })
  })
})
