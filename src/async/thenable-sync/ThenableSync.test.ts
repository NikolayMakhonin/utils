import {createTestVariants} from '@flemist/test-variants'
import {resolveAsync, ThenableSync} from './ThenableSync'
import {ThenableOrValue, TOnFulfilled, TOnRejected, TResolveAsyncValue} from './async'

enum AsyncType {
  Value = 'Value',
  ThenableSync = 'ThenableSync',
  Iterator = 'Iterator',
  Promise = 'Promise',

  ThenableSyncError = 'ThenableSyncError',
  IteratorError = 'IteratorError',
  PromiseError = 'PromiseError',
}

// const asyncTypesValues = Object.values(AsyncType)
const asyncTypesValues = [
  AsyncType.Value,
  AsyncType.ThenableSync,
  AsyncType.Iterator,
  AsyncType.Promise,
  AsyncType.ThenableSyncError,
  AsyncType.IteratorError,
  AsyncType.PromiseError,
]

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
        value = (function *iterator(_value) {
          const result = yield _value
          return result
        })(value)
        break
      case AsyncType.IteratorError:
        value = (function *iterator(_value) {
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
    value = new CustomValue('value', value)
  }
  return value
}

describe('thenable-sync > ThenableSync', function () {
  this.timeout(6000000)

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

  const testVariants = createTestVariants(({
    dontThrowOnImmediateError,
    hasCustomResolveValue,
    isError,
    inputValue,
    inputAsyncType1,
    inputAsyncType2,

    hasOnfulfilled,
    onfulfilledAsyncType1,
    onfulfilledAsyncType2,

    hasOnrejected,
    onrejectedAsyncType1,
    onrejectedAsyncType2,
  }: {
    dontThrowOnImmediateError: boolean,
    hasCustomResolveValue: boolean,
    isError: boolean,
    inputValue: any,
    inputAsyncType1: AsyncType,
    inputAsyncType2: AsyncType,

    hasOnfulfilled: boolean,
    onfulfilledAsyncType1: AsyncType,
    onfulfilledAsyncType2: AsyncType,

    hasOnrejected: boolean,
    onrejectedAsyncType1: AsyncType,
    onrejectedAsyncType2: AsyncType,
  }) => {
    const errors: Error[] = []
    function catchError<TFunc extends (this: any, ...args: any[]) => any>(func: TFunc): TFunc {
      return function _catchError() {
        try {
          return func.apply(this, arguments)
        }
        catch (err) {
          errors.push(err)
          throw err
        }
      } as any
    }
    function throwIfError() {
      if (errors.length > 0) {
        throw errors[0]
      }
    }

    assert.ok(!isPromise(inputValue))

    if (!hasOnfulfilled) {
      assert.strictEqual(onfulfilledAsyncType1, AsyncType.Value)
      assert.strictEqual(onfulfilledAsyncType2, AsyncType.Value)
    }

    if (!hasOnrejected) {
      assert.strictEqual(onrejectedAsyncType1, AsyncType.Value)
      assert.strictEqual(onrejectedAsyncType2, AsyncType.Value)
    }

    const inputHasError = isError || asyncTypeIsError(inputAsyncType1) || asyncTypeIsError(inputAsyncType2)
    const resultHasError = inputHasError
      ? !hasOnrejected || asyncTypeIsError(onrejectedAsyncType1) || asyncTypeIsError(onrejectedAsyncType2)
      : hasOnfulfilled && (asyncTypeIsError(onfulfilledAsyncType1) || asyncTypeIsError(onfulfilledAsyncType2))

    const hasPromise = asyncTypeIsPromise(inputAsyncType1) || asyncTypeIsPromise(inputAsyncType2)
      || (
        inputHasError
          ? hasOnrejected && (asyncTypeIsPromise(onrejectedAsyncType1) || asyncTypeIsPromise(onrejectedAsyncType2))
          : hasOnfulfilled && (asyncTypeIsPromise(onfulfilledAsyncType1) || asyncTypeIsPromise(onfulfilledAsyncType2))
      )

    const customResolveValue: TResolveAsyncValue = !hasCustomResolveValue
      ? void 0
      : catchError((value) => {
        if (value instanceof CustomValue && value.type === 'value') {
          return value.value
        }
        return value
      })

    const onfulfilled: TOnFulfilled = !hasOnfulfilled
      ? void 0
      : catchError((value) => {
        assert.ok(!inputHasError)
        assert.ok(value instanceof CustomValue)
        assert.strictEqual(value.type, 'onfulfilled')
        value = value.value
        return createAsyncValue(value, hasCustomResolveValue, onfulfilledAsyncType1, onfulfilledAsyncType2)
      })

    const onrejected: TOnRejected = !hasOnrejected
      ? void 0
      : catchError((value) => {
        assert.ok(inputHasError)
        assert.ok(value instanceof CustomValue)
        assert.strictEqual(value.type, 'onrejected')
        value = value.value
        return createAsyncValue(value, hasCustomResolveValue, onrejectedAsyncType1, onrejectedAsyncType2)
      })

    let _inputValue = inputValue
    if (hasOnfulfilled && !inputHasError) {
      _inputValue = new CustomValue('onfulfilled', _inputValue)
    }
    if (hasOnrejected && inputHasError) {
      _inputValue = new CustomValue('onrejected', _inputValue)
    }
    let input = createAsyncValue(_inputValue, hasCustomResolveValue, inputAsyncType1, inputAsyncType2)


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
    }
    catch (err) {
      throwIfError()
      if (!resultHasError) {
        throw err
      }
      result = err
      assert.ok(!isPromise(result))
    }
    throwIfError()

    if (!hasPromise && resultHasError && dontThrowOnImmediateError) {
      assert.ok(result instanceof ThenableSync)
      try {
        resolveAsync(result)
        errors.push(new Error('result should throw error'))
      }
      catch (err) {
        result = err
      }
    }

    function onEnd() {
      throwIfError()
      assert.ok(!isPromise(result))
      assert.deepStrictEqual(result, inputValue)
    }

    if (hasPromise) {
      assert.ok(result instanceof ThenableSync)
      return (async () => {
        try {
          result = await result
        } catch (err) {
          throwIfError()
          if (!resultHasError) {
            throw err
          }
          result = err
        }
        onEnd()
      })()
    } else {
      onEnd()
    }
  })
  
  it('resolveAsync', async function () {
    const iterations = await testVariants({
      hasCustomResolveValue    : [false, true],
      dontThrowOnImmediateError: [false, true],
      isError                  : [false, true],
      inputValue               : [0, void 0, null, 1, '0', { a: 1 }, Symbol('sym')],
      inputAsyncType1          : asyncTypesValues,
      inputAsyncType2          : asyncTypesValues,

      hasOnfulfilled       : [false, true],
      onfulfilledAsyncType1: ({hasOnfulfilled}) => !hasOnfulfilled ? [AsyncType.Value] : asyncTypesValues,
      onfulfilledAsyncType2: ({hasOnfulfilled}) => !hasOnfulfilled ? [AsyncType.Value] : asyncTypesValues,

      hasOnrejected       : [false, true],
      onrejectedAsyncType1: ({hasOnrejected}) => !hasOnrejected ? [AsyncType.Value] : asyncTypesValues,
      onrejectedAsyncType2: ({hasOnrejected}) => !hasOnrejected ? [AsyncType.Value] : asyncTypesValues,
    })

    console.log('iterations: ' + iterations)
  })

  it('million promises', async function () {
    const promises: Promise<any>[] = []
    for (let i = 0; i < 1000000; i++) {
      promises.push(new Promise(() => {}).then(() => {
        console.log('wer')
      }))
    }

    // await Promise.all(promises)
  })
})
