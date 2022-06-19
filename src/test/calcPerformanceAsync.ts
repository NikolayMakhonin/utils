import {
  rdtsc,
  setThreadPriority,
  getThreadPriority,
  setProcessPriority,
  getProcessPriority,
  PROCESS_PRIORITY_REALTIME,
  THREAD_PRIORITY_REALTIME,
  isWin,
} from 'rdtsc'

export async function runInRealtimePriorityAsync<T>(func: () => Promise<T>|T): Promise<T> {
  if (!isWin) {
    return func()
  }

  const previousThreadPriority = getThreadPriority()
  const previousProcessPriority = getProcessPriority()

  try {
    setProcessPriority(PROCESS_PRIORITY_REALTIME)
    setThreadPriority(THREAD_PRIORITY_REALTIME)

    return await func()
  }
  finally {
    setProcessPriority(previousProcessPriority)
    setThreadPriority(previousThreadPriority)
  }
}

export function calcPerformanceAsync(testTimeMilliseconds, ...funcs: (() => any)[]) {
  return runInRealtimePriorityAsync(async () => {
    const testTime = testTimeMilliseconds
    if (!testTime || testTime <= 0) {
      throw new Error(`testTime ${testTime} <= 0`)
    }

    const f = funcs.flatMap(o => {
      if (o == null) {
        return []
      }
      if (Array.isArray(o)) {
        return o
      }
      return [o]
    })
      .filter(o => {
        if (typeof o !== 'function') {
          throw new Error(`argument (${o}) is not a function`)
        }
        return true
      })

    const funcsCount = f.length

    if (!funcsCount) {
      throw new Error('functions count == 0')
    }

    const endTime = process.hrtime()
    endTime[0] += ~~(testTime / 1000)
    endTime[1] += testTime % 1000

    let i = 0
    let count = funcsCount
    const startCycles = rdtsc()
    const cycles: bigint[] = []
    do {
      const funcIndex = i % funcsCount
      const fn = f[funcIndex]
      
      const cycles0: bigint = rdtsc()
      await fn()
      const cycles1: bigint = rdtsc()
      
      const cyclesDiff = cycles1 - cycles0
      if (i < funcsCount || cyclesDiff < cycles[funcIndex]) {
        cycles[funcIndex] = cyclesDiff
      }

      i++
      if (i >= count) {
        const time = process.hrtime(endTime)
        if (time[0] >= 0) {
          break
        }
        count = ~~Math.ceil(i * testTime / (testTime + time[0] * 1000 + time[1] / 1000000))
        count = (~~(count / funcsCount)) * funcsCount
      }
    } while (true)

    const absoluteDiff = funcsCount > 1
      ? cycles.filter((o, i) => i).map(o => Number(o - cycles[0]))
      : void 0

    const relativeDiff = funcsCount > 2 && absoluteDiff[0] > 0
      ? absoluteDiff.filter((o, i) => i).map(o => o / absoluteDiff[0])
      : void 0

    return {
      calcInfo: {
        iterationCycles: Number(rdtsc() - startCycles) / i,
        iterations     : i,
        funcsCount,
        testTime,
      },
      cycles,
      absoluteDiff,
      relativeDiff,
    }
  })
}
