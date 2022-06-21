import {Priority, priorityCompare, priorityCreate} from './Priority'
import {createTestVariants} from '@flemist/test-variants'

describe('priority > Priority', function () {
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
  
  function orderToString(order: number) {
    return order == null
      ? '50'
      : (order + 50).toString(10).padStart(2, '0')
  }

  function createTestPriorityStr(
    order1: number,
    order2: number,
    order3: number,
    order4: number,
    order5: number,
  ) {
    let str = orderToString(order1)
    str += orderToString(order2)
    str += orderToString(order3)
    str += orderToString(order4)
    str += orderToString(order5)
    return str
  }
  
  function createTestPriority(
    order1: number,
    order2: number,
    order3: number,
    order4: number,
    order5: number,
  ) {
    let priority = priorityCreate(order1)
    if (order2 != null) {
      priorityCreate(order2, priority)
    }
    if (order3 != null) {
      priorityCreate(order3, priority)
    }
    if (order4 != null) {
      priorityCreate(order4, priority)
    }
    if (order5 != null) {
      priorityCreate(order5, priority)
    }
    return priority
  }
  
  const testVariants = createTestVariants(({
    order1_1,
    order1_2,
    order1_3,
    order1_4,
    order1_5,

    order2_1,
    order2_2,
    order2_3,
    order2_4,
    order2_5,
  }: {
    order1_1: number,
    order1_2: number,
    order1_3: number,
    order1_4: number,
    order1_5: number,

    order2_1: number,
    order2_2: number,
    order2_3: number,
    order2_4: number,
    order2_5: number,
  }) => {
    const priority1Str = createTestPriorityStr(
      order1_1,
      order1_2,
      order1_3,
      order1_4,
      order1_5,
    )
    const priority2Str = createTestPriorityStr(
      order2_1,
      order2_2,
      order2_3,
      order2_4,
      order2_5,
    )
    
    const priority1 = createTestPriority(
      order1_1,
      order1_2,
      order1_3,
      order1_4,
      order1_5,
    )
    const priority2 = createTestPriority(
      order2_1,
      order2_2,
      order2_3,
      order2_4,
      order2_5,
    )

    const expected = priority1Str === priority2Str ? 0
      : priority1Str > priority2Str ? 1
        : -1
    const actual = priorityCompare(priority1, priority2)
    
    assert.strictEqual(actual, expected, priority1Str + ', ' + priority2Str)
  })

  it('variants', async function () {
    await testVariants({
      order1_1: [-1, 0, 1],
      order1_2: ({order1_1}) => order1_1 == null ? [null] : [null, -1, 0, 1],
      order1_3: ({order1_2}) => order1_2 == null ? [null] : [null, -1, 0, 1],
      order1_4: ({order1_3}) => order1_3 == null ? [null] : [null, -1, 0, 1],
      order1_5: ({order1_4}) => order1_4 == null ? [null] : [null, -1, 0, 1],
      
      order2_1: [-1, 0, 1],
      order2_2: ({order2_1}) => order2_1 == null ? [null] : [null, -1, 0, 1],
      order2_3: ({order2_2}) => order2_2 == null ? [null] : [null, -1, 0, 1],
      order2_4: ({order2_3}) => order2_3 == null ? [null] : [null, -1, 0, 1],
      order2_5: ({order2_4}) => order2_4 == null ? [null] : [null, -1, 0, 1],
    })()
  })
})
