import {createTestVariantsSync} from '@flemist/test-variants'
import {TimeControllerMock} from './timeControllerMock'
import {ITimeController} from './contracts'
import {timeControllerDefault} from './timeControllerDefault'

describe('time-controller > timeControllerMock', function () {
  function test({
    timeController,
    times,
    postDelay,
  }: {
    timeController: ITimeController,
    times: [start: number|null, timeout: number, abort: number|null][],
    postDelay: number,
  }) {
    return new Promise<string[]>((resolve, reject) => {
      const result: string[] = []
      let timeMax = 0
      for (let i = 0, len = times.length; i < len; i++) {
        const time = times[i]
        const index = i
        timeMax = Math.max((time[0] || 0) + Math.max(time[1] || 0, time[2] || 0))

        const start = () => {
          const handle = timeController.setTimeout(() => {
            result.push(`completed: ${index}`)
          }, time[1])

          if (time[2] != null) {
            if (time[2] < 0) {
              timeController.clearTimeout(handle)
            }
            else {
              timeController.setTimeout(() => {
                timeController.clearTimeout(handle)
                result.push(`aborted: ${index}`)
              }, time[2])
            }
          }
        }

        if (time[0] == null) {
          start()
        }
        else {
          timeController.setTimeout(start, time[0])
        }
      }

      timeController.setTimeout(() => {
        resolve(result)
      }, timeMax + postDelay)
    })
  }

  const testVariants = createTestVariantsSync(({
    times,
  }: {
    times: [start: number|null, timeout: number, abort: number|null][],
  }) => {
    const timeController = new TimeControllerMock()
    const actual = test({
      timeController,
      times,
      postDelay: 100000000,
    })
    const expected = test({
      timeController: timeControllerDefault,
      times,
      postDelay     : 100,
    })
    assert.deepStrictEqual(actual, expected)
  })

  it('base', async function () {
    testVariants({
      times: [
        [[0, 0, null]],
      ],
    })
  })
})
