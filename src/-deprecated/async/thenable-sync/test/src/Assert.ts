export type TClass<T> = new (...args: any[]) => T

export const AssertionError = // typeof require === 'function'
// eslint-disable-next-line global-require
  //? require('assertion-error')
//   :
class extends Error { }

if (!console.debug) {
  console.debug = console.info
}

export class Assert {
  fail(message?: string) {
    this.throwAssertionError(null, null, message)
  }

  ok(value, message?: string) {
    if (!value) {
      this.throwAssertionError(value, true, message)
    }
  }

  notOk(value, message?: string) {
    if (value) {
      this.throwAssertionError(value, false, message)
    }
  }

  strictEqual(actual, expected, message?: string) {
    if (actual !== expected) {
      this.throwAssertionError(actual, expected, message)
    }
  }

  notStrictEqual(actual, expected, message?: string) {
    if (actual === expected) {
      this.throwAssertionError(actual, expected, message)
    }
  }

  equal(actual, expected, message?: string) {
    // eslint-disable-next-line eqeqeq
    if (actual != expected) {
      this.throwAssertionError(actual, expected, message)
    }
  }

  notEqual(actual, expected, message?: string) {
    // eslint-disable-next-line eqeqeq
    if (actual == expected) {
      this.throwAssertionError(actual, expected, message)
    }
  }

  equalCustom(actual, expected, check, message?: string) {
    if (!check(actual, expected)) {
      this.throwAssertionError(actual, expected, message)
    }
  }

  private assertError(err: Error, errType?: TClass<any>|Array<TClass<any>>, regExp?: RegExp, message?: string) {
    this.ok(err)

    if (err instanceof AssertionError) {
      const index = Assert.errors.indexOf(err)
      Assert.errors.splice(index, 1)
    }

    if (errType) {
      const actualErrType = err.constructor
      if (Array.isArray(errType)) {
        if (!errType.some(o => o === actualErrType)) {
          this.throwAssertionError(
            actualErrType.name,
            errType.map(o => o && o.name),
            err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message)
        }
      }
      else if (actualErrType !== errType) {
        this.throwAssertionError(
          actualErrType.name,
          errType.name,
          err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message)
      }
    }

    if (regExp) {
      this.ok(
        regExp.test(err.message),
        err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message,
      )
    }
  }

  async throwsAsync(
    fn: () => Promise<void>,
    errType?: TClass<any>|Array<TClass<any>>,
    regExp?: RegExp, message?: string,
  ): Promise<void> {
    let err
    try {
      await fn()
    }
    catch (ex) {
      err = ex
    }

    this.assertError(err, errType, regExp, message)
  }

  throws(
    fn: () => void,
    errType?: TClass<any>|Array<TClass<any>>,
    regExp?: RegExp, message?: string,
  ): void {
    let err
    try {
      fn()
    }
    catch (ex) {
      err = ex
    }

    this.assertError(err, errType, regExp, message)
  }

  assertNotHandledErrors() {
    if (Assert.errors.length) {
      const firstError = Assert.errors[0]
      Assert.errors = []
      throw firstError
    }
  }

  static errors: Error[] = []

  // noinspection JSMethodCanBeStatic
  throwAssertionError(actual, expected, message?: string) {
    console.debug('actual: ', actual)
    console.debug('expected: ', expected)
    const error = new AssertionError(message, {
      actual,
      expected,
      showDiff: true,
    } as any)

    if (!Assert.errors) {
      Assert.errors = [error]
    }
    else {
      Assert.errors.push(error)
    }

    throw error
  }
}

export const assert = new Assert()
