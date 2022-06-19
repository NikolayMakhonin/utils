import {ObjectPool} from 'src/sync/object-pool'
import {PairingHeap, PairingNode, TLessThanFunc} from './PairingHeap'
import {createTestVariantsSync} from '@flemist/test-variants'

describe('pairing-heap > PairingHeap', function () {
  this.timeout(6000000)

  const testVariants = createTestVariantsSync(({
    objectPoolSize,
    count,
    sort,
  }: {
    objectPoolSize: number,
    count: number,
    sort: -1|1,
  }) => {
    const objectPool = objectPoolSize == null ? null : new ObjectPool<PairingNode<number>>(objectPoolSize)
    const lessThanFunc: TLessThanFunc<number> = sort == null
      ? null
      : function lessThanFunc(o1, o2) {
        if (sort > 0) {
          return o1 < o2
        }
        else {
          return o2 < o1
        }
      }
    const heap = new PairingHeap<number>({objectPool, lessThanFunc})
    const items: number[] = new Array(count)

    let iterations = 1
    for (let i = 0; i < count; i++) {
      items[i] = i
      if (i < 7) {
        iterations *= i + 1
      }
    }
    items.sort(() => Math.random() > 0.5 ? 1 : -1)

    assert.strictEqual(heap.size, 0)
    assert.strictEqual(heap.isEmpty, true)

    for (let iteration = 0; iteration < iterations; iteration++) {
      const nodes: PairingNode<number>[] = new Array(count)
      for (let i = 0; i < count; i++) {
        const node = heap.add(items[i])
        assert.ok(node)
        nodes.push(node)
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)
      }

      nodes.sort(() => Math.random() > 0.5 ? 1 : -1)
      for (let i = 0; i < count; i++) {
        const node = nodes[i]
        heap.delete(node)
        assert.strictEqual(heap.size, count - i - 1)
        assert.strictEqual(heap.isEmpty, i === count - 1)
      }

      assert.strictEqual(heap.size, 0)
      assert.strictEqual(heap.isEmpty, true)

      for (let i = 0; i < count; i++) {
        const node = heap.add(items[i])
        assert.ok(node)
        assert.strictEqual(heap.size, i + 1)
        assert.strictEqual(heap.isEmpty, false)
      }

      for (let i = 0; i < count; i++) {
        const valueMin = heap.getMin()
        assert.strictEqual(valueMin, sort === -1 ? count - i - 1 : i)
        
        assert.strictEqual(heap.size, count - i)
        assert.strictEqual(heap.isEmpty, false)
        
        const valueDeleted = heap.deleteMin()
        
        assert.strictEqual(valueDeleted, sort === -1 ? count - i - 1 : i)
        assert.strictEqual(heap.size, count - i - 1)
        assert.strictEqual(heap.isEmpty, i === count - 1)
      }

      assert.strictEqual(heap.size, 0)
      assert.strictEqual(heap.isEmpty, true)
    }

    return iterations
  })

  it('base', function () {
    const iterations = testVariants({
      objectPoolSize: [null, 0, 1, 3, 10],
      sort          : [null, 1, -1],
      count         : [0, 1, 2, 3, 4, 5, 6, 7, 10, 100],
    })

    console.log('iterations: ' + iterations)
  })
})
