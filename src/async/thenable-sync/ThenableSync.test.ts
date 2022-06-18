import {createTestVariants} from '@flemist/test-variants'
import {resolveAsync, TExecutor, ThenableSync} from './ThenableSync'
import {ThenableOrIteratorOrValue, ThenableOrValue, TOnFulfilled, TOnRejected, TResolveAsyncValue} from './async'

enum ValueType {
  string = 'string',
  thenableSyncResolved = 'thenableSyncResolved',
  thenableSyncRejected = 'thenableSyncRejected',
  thenableSyncResolvedResolved = 'thenableSyncResolvedResolved',
  thenableSyncResolvedRejected = 'thenableSyncResolvedRejected',
  thenableSyncRejectedResolved = 'thenableSyncRejectedResolved',
  thenableSyncRejectedRejected = 'thenableSyncRejectedRejected',
}

enum AsyncType {
  Value = 'Value',
  ThenableSync = 'ThenableSync',
  Iterator = 'Iterator',
  Promise = 'Promise',

  ThenableSyncError = 'ThenableSyncError',
  IteratorError = 'IteratorError',
  PromiseError = 'PromiseError',
}

function asyncTypeIsError(type: AsyncType) {
  switch (type) {
    case AsyncType.ThenableSyncError:
    case AsyncType.IteratorError:
    case AsyncType.PromiseError:
      return true
    default:
      return false
  }
}

function isPromise(value) {
  return value && typeof value === 'object'
    && value.constructor?.name === 'Promise'
    && typeof value.then === 'function'
}

function asyncTypeIsPromise(type: AsyncType) {
  switch (type) {
    case AsyncType.Promise:
    case AsyncType.PromiseError:
      return true
    default:
      return false
  }
}

class CustomValue {
  type: string
  value
  constructor(type: string, value) {
    this.type = type
    this.value = value
  }
}

function createAsyncValue(value: any, isCustomValue: boolean, ...asyncTypes: AsyncType[]) {
  if (isCustomValue) {
    value = new CustomValue('value', value)
  }
  let last = false
  for (let i = 0, len = asyncTypes.length; i < len; i++) {
    const asyncType = asyncTypes[i]
    if (last) {
      assert.ok(!asyncType)
      continue
    }
    if (!asyncType) {
      last = true
      continue
    }

    switch (asyncType) {
      case AsyncType.Value:
        break

      case AsyncType.ThenableSync:
        value = ThenableSync.createResolved(value)
        break
      case AsyncType.ThenableSyncError:
        value = ThenableSync.createRejected(value)
        break

      case AsyncType.Iterator:
        value = ((_value) => function *iterator() {
          const result = yield _value
          return result
        })(value)
        break
      case AsyncType.IteratorError:
        value = ((_value) => function *iterator() {
          const result = yield _value
          throw result
        })(value)
        break

      case AsyncType.Promise:
        value = Promise.resolve(value)
        break
      case AsyncType.PromiseError:
        value = Promise.reject(value)
        break

      default:
        throw new Error('Unknown AsyncType: ' + asyncType)
    }
  }
  if (isCustomValue) {
    value = new CustomValue(value)
  }
  return value
}

describe('thenable-sync > ThenableSync', function () {
  // let valueId: number = 0
  // function getValueSimple(type: ValueType) {
  //   valueId++
  //   switch (type) {
  //     case ValueType.string:
  //       return valueId.toString()
  //     case ValueType.thenableSync:
  //       return ThenableSync.createResolved(valueId)
  //     case ValueType.thenableSync:
  //       return ThenableSync.createResolved(ThenableSync.createResolved(valueId))
  //     default:
  //       throw new Error(`Unknown ValueType: ${type}`)
  //   }
  // }
  //
  // function createThenableSync(results: any[]) {
  //   const hasExecutor: boolean
  //   const customResolveValueConstructor: TResolveAsyncValue
  //   const customResolveValueThen: TResolveAsyncValue
  //
  //   let currentStep: number
  //
  //   function createCallback(name: string, returnType: ValueType) {
  //     return function (value) {
  //       results.push([name, value])
  //       return getValue(returnType)
  //     }
  //   }
  //   const returnType1: ValueType
  //   const onfulfilled1: TOnFulfilled<string, string> = createCallback('fulfilled 1', returnType1)
  //   const onrejected1: TOnRejected<string> = createCallback('rejected 1', returnType1)
  //
  //   const onfulfilled2: TOnFulfilled<string, string>
  //   const onrejected2: TOnRejected<string>
  //
  //   const onfulfilled3: TOnFulfilled<string, string>
  //   const onrejected3: TOnRejected<string>
  //
  //   const onfulfilled4: TOnFulfilled<string, string>
  //   const onrejected4: TOnRejected<string>
  //
  //   const onfulfilled5: TOnFulfilled<string, string>
  //   const onrejected5: TOnRejected<string>
  //
  //   const onfulfilled6: TOnFulfilled<string, string>
  //   const onrejected6: TOnRejected<string>
  //
  //   const resolveStep: number
  //   const resolveMultiple: boolean
  //   const resolveValue: ThenableOrIteratorOrValue<string>
  //   const rejectStep: number
  //   const rejectMultiple: boolean
  //   const rejectValue: ThenableOrIteratorOrValue<string>
  //
  //   let thenableSync: ThenableSync<string>
  //   let resolve: (value?: ThenableOrIteratorOrValue<string>) => void
  //   let reject: (value?: ThenableOrIteratorOrValue<string>) => void
  //   let executor: TExecutor<string>
  //   if (hasExecutor) {
  //     executor = (_resolve, _reject) => {
  //       resolve = _resolve
  //       reject = _reject
  //     }
  //   } else {
  //     resolve = function resolve(value) {
  //       thenableSync.resolve(resolveValue)
  //     }
  //     reject = function reject(value) {
  //       thenableSync.reject(rejectValue)
  //     }
  //   }
  //
  //   thenableSync = new ThenableSync<string>(executor, customResolveValueConstructor)
  //
  //   function setStep(step: number) {
  //     currentStep = step
  //     if (resolveStep === step) {
  //       resolve(resolveValue)
  //     }
  //     if (resolveMultiple && resolveStep >= step) {
  //       resolve(new Error(`resolveMultiple, step=${step}`) as any)
  //     }
  //     if (rejectStep === step) {
  //       reject(rejectValue)
  //     }
  //     if (rejectMultiple && rejectStep >= step) {
  //       reject(new Error(`rejectMultiple, step=${step}`) as any)
  //     }
  //   }
  //
  //   setStep(0)
  //   if (onfulfilled1 || onrejected1) {
  //     thenableSync.then(onfulfilled1, onrejected1, customResolveValueThen)
  //     setStep(1)
  //     if (onfulfilled2 || onrejected2) {
  //       thenableSync.then(onfulfilled2, onrejected2, customResolveValueThen)
  //       setStep(2)
  //     }
  //   }
  //   if (onfulfilled3 || onrejected3) {
  //     thenableSync.then(onfulfilled3, onrejected3, customResolveValueThen)
  //     setStep(3)
  //     if (onfulfilled4 || onrejected4) {
  //       thenableSync.then(onfulfilled4, onrejected4, customResolveValueThen)
  //       setStep(4)
  //     }
  //     if (onfulfilled5 || onrejected5) {
  //       thenableSync.then(onfulfilled5, onrejected5, customResolveValueThen)
  //       setStep(5)
  //       if (onfulfilled6 || onrejected6) {
  //         thenableSync.then(onfulfilled6, onrejected6, customResolveValueThen)
  //         setStep(6)
  //       }
  //     }
  //   }
  // }

  const testVariants = createTestVariants(async ({
    values,
  }: {
    values: boolean,
  }) => {
    const errors: Error[] = []
    function catchError<TFunc extends (this: any, ...args: any[]) => any>(func: TFunc): TFunc {
      return function func() {
        try {
          return func.apply(this, arguments)
        } catch (err) {
          errors.push(err)
          throw err
        }
      } as any
    }

    const dontThrowOnImmediateError: boolean
    const isError: boolean

    const hasCustomResolveValue: boolean

    const hasOnfulfilled: boolean
    const onfulfilledAsyncType1: AsyncType
    const onfulfilledAsyncType2: AsyncType

    const hasOnrejected: boolean
    const onrejectedAsyncType1: AsyncType
    const onrejectedAsyncType2: AsyncType

    const inputPlace: 'input' | 'onfulfilled' | 'onrejected'
    const inputValue: any
    const inputAsyncType1: AsyncType
    const inputAsyncType2: AsyncType

    assert.ok(!isPromise(inputValue))

    const hasError = isError
      || asyncTypeIsError(inputAsyncType1) || asyncTypeIsError(inputAsyncType2)
      || asyncTypeIsError(onfulfilledAsyncType1) || asyncTypeIsError(onfulfilledAsyncType2)

    const hasPromise = asyncTypeIsPromise(inputAsyncType1) || asyncTypeIsPromise(inputAsyncType2)
      || asyncTypeIsPromise(onfulfilledAsyncType1) || asyncTypeIsPromise(onfulfilledAsyncType2)

    const customResolveValue: TResolveAsyncValue = !hasCustomResolveValue
      ? void 0
      : catchError((value) => {
        assert.ok(value instanceof CustomValue)
        assert.ok(value.type === 'value')
        return value.value
      })

    const onfulfilled: TOnFulfilled = !hasOnfulfilled
      ? void 0
      : catchError((value) => {
        assert.ok(!hasError)
        assert.ok(value instanceof CustomValue)
        assert.ok(value.type === 'onfulfilled')
        value = value.value
        return createAsyncValue(value, hasCustomResolveValue, onfulfilledAsyncType1, onfulfilledAsyncType2)
      })

    const onrejected: TOnRejected = !hasOnrejected
      ? void 0
      : catchError((value) => {
        assert.ok(hasError)
        assert.ok(value instanceof CustomValue)
        assert.ok(value.type === 'onrejected')
        value = value.value
        return createAsyncValue(value, hasCustomResolveValue, onrejectedAsyncType1, onrejectedAsyncType2)
      })

    let input = createAsyncValue(inputValue, hasCustomResolveValue, inputAsyncType1, inputAsyncType2)

    if (hasOnfulfilled && !hasError) {
      input = new CustomValue('onfulfilled', input)
    }
    if (hasOnrejected && hasError) {
      input = new CustomValue('onrejected', input)
    }

    let result: ThenableOrValue<any>
    try {
      result = resolveAsync(
        input,
        onfulfilled,
        onrejected,
        dontThrowOnImmediateError,
        customResolveValue,
        isError,
      )
    } catch (err) {
      if (!hasError) {
        throw err
      }
      result = err
    }

    if (hasPromise) {
      assert.ok(isPromise(result))
      try {
        result = await result
      } catch (err) {
        if (!hasError) {
          throw err
        }
        result = err
      }
    }

    assert.ok(!isPromise(result))
    assert.deepStrictEqual(result, inputValue)
  })
  
  it('resolveAsync', function () {
    
  })
})
