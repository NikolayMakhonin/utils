import {PriorityQueue} from './PriorityQueue'
import {priorityCreate} from 'src/sync/priority'

describe('helpers > PriorityQueue', function () {
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
})
