/* eslint-disable */
import {calcPerformanceAsync} from '../../../test/calcPerformanceAsync'
import {resolveAsync, ThenableSync} from "./ThenableSync";

describe('thenable-sync > ThenableSync perf', function () {
  this.timeout(600000)

  it('base', async function () {
    const thenableSync = ThenableSync.createResolved('thenableSync')
    function *funcGenerator() {
      // for (let i = 0; i < 20; i++) {
      //   yield thenableSync
      // }
      return thenableSync
    }
    function runThenableSync() {
      return resolveAsync(funcGenerator())
    }

    const promise = Promise.resolve('promise')
    async function runPromise() {
      // for (let i = 0; i < 20; i++) {
      //   await promise
      // }
      return promise
    }

    assert.strictEqual(await runThenableSync(), 'thenableSync')
    assert.strictEqual(await runPromise(), 'promise')

    let result = await calcPerformanceAsync(
      10000,
      () => {

      },
      () => {
        return runThenableSync()
      },
      () => {
        return runPromise()
      },
    )
    
    console.log(result)
  })
})
