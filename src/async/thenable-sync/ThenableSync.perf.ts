/* eslint-disable */
import {calcPerformanceAsync} from '../calc-perfoemance-async/calcPerformanceAsync'
import {resolveAsync} from "./ThenableSync";

describe('thenable-sync > ThenableSync perf', function () {
  this.timeout(600000)

  it('base', async function () {
    function *funcGenerator() {
      for (let i = 0; i < 2; i++) {
        yield i
      }
    }
    function iterate() {
      for (const item of funcGenerator()) {

      }
    }
    function thenableSync() {
      return resolveAsync(funcGenerator())
    }
    async function funcAsync() {
      for (let i = 0; i < 2; i++) {
        await i
      }
    }

    let result = await calcPerformanceAsync(
      10000,
      () => {

      },
      // () => {
      //   iterate()
      // },
      () => {
        return thenableSync()
      },
      () => {
        return funcAsync()
      },
    )
    
    console.log(result)
  })
})
