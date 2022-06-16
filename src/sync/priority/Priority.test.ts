import {Priority, priorityCompare, priorityCreate} from './Priority'

describe('helpers > Priority', function () {
  function test(o1: Priority, o2: Priority, checkResult: -1 | 0 | 1) {
    let result = priorityCompare(o1, o2)
    assert.strictEqual(result, checkResult)
    result = priorityCompare(o2, o1)
    if (result !== 0) {
      result = -result
    }
    assert.strictEqual(result, checkResult)
  }

  it('base', function () {
    test(void 0, void 0, 0)
    test(null, null, 0)
    test(void 0, null, 0)

    test(null, priorityCreate(0), 1)
    test(null, priorityCreate(-1), 1)
    test(null, priorityCreate(1), -1)

    test(void 0, priorityCreate(0), 1)
    test(void 0, priorityCreate(-1), 1)
    test(void 0, priorityCreate(1), -1)

    test(priorityCreate(0), priorityCreate(0), 0)
    test(priorityCreate(0), priorityCreate(1), -1)
    test(priorityCreate(0), priorityCreate(-1), 1)

    test(priorityCreate(1), priorityCreate(1), 0)
    test(priorityCreate(-1), priorityCreate(-1), 0)
    test(priorityCreate(1), priorityCreate(-1), 1)

    test(priorityCreate(0), priorityCreate(0, priorityCreate(0)), 1)
    test(priorityCreate(0), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(0), priorityCreate(0, priorityCreate(1)), -1)
    test(priorityCreate(0), priorityCreate(1, priorityCreate(0)), -1)
    test(priorityCreate(0), priorityCreate(-1, priorityCreate(0)), 1)

    test(priorityCreate(-1), priorityCreate(0, priorityCreate(0)), -1)
    test(priorityCreate(-1), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(-1), priorityCreate(0, priorityCreate(1)), -1)

    test(priorityCreate(1), priorityCreate(0, priorityCreate(0)), 1)
    test(priorityCreate(1), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(1), priorityCreate(0, priorityCreate(1)), 1)


    test(priorityCreate(0, priorityCreate(0)), priorityCreate(0, priorityCreate(0)), 0)
    test(priorityCreate(0, priorityCreate(0)), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(0, priorityCreate(0)), priorityCreate(0, priorityCreate(1)), -1)

    test(priorityCreate(-1, priorityCreate(0)), priorityCreate(0, priorityCreate(0)), -1)
    test(priorityCreate(-1, priorityCreate(0)), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(-1, priorityCreate(0)), priorityCreate(0, priorityCreate(1)), -1)

    test(priorityCreate(1, priorityCreate(0)), priorityCreate(0, priorityCreate(0)), 1)
    test(priorityCreate(1, priorityCreate(0)), priorityCreate(0, priorityCreate(-1)), 1)
    test(priorityCreate(1, priorityCreate(0)), priorityCreate(0, priorityCreate(1)), -1)
  })
})
