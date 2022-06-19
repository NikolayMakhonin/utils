'use strict';

var tslib = require('tslib');

const AssertionError = // typeof require === 'function'
 
// eslint-disable-next-line global-require
// ? require('assertion-error')
//   :
class extends Error {
};
if (!console.debug) {
    console.debug = console.info;
}
class Assert {
    fail(message) {
        this.throwAssertionError(null, null, message);
    }
    ok(value, message) {
        if (!value) {
            this.throwAssertionError(value, true, message);
        }
    }
    notOk(value, message) {
        if (value) {
            this.throwAssertionError(value, false, message);
        }
    }
    strictEqual(actual, expected, message) {
        if (actual !== expected) {
            this.throwAssertionError(actual, expected, message);
        }
    }
    notStrictEqual(actual, expected, message) {
        if (actual === expected) {
            this.throwAssertionError(actual, expected, message);
        }
    }
    equal(actual, expected, message) {
        // eslint-disable-next-line eqeqeq
        if (actual != expected) {
            this.throwAssertionError(actual, expected, message);
        }
    }
    notEqual(actual, expected, message) {
        // eslint-disable-next-line eqeqeq
        if (actual == expected) {
            this.throwAssertionError(actual, expected, message);
        }
    }
    equalCustom(actual, expected, check, message) {
        if (!check(actual, expected)) {
            this.throwAssertionError(actual, expected, message);
        }
    }
    assertError(err, errType, regExp, message) {
        this.ok(err);
        if (err instanceof AssertionError) {
            const index = Assert.errors.indexOf(err);
            Assert.errors.splice(index, 1);
        }
        if (errType) {
            const actualErrType = err.constructor;
            if (Array.isArray(errType)) {
                if (!errType.some(o => o === actualErrType)) {
                    this.throwAssertionError(actualErrType.name, errType.map(o => o && o.name), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
                }
            }
            else if (actualErrType !== errType) {
                this.throwAssertionError(actualErrType.name, errType.name, err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
            }
        }
        if (regExp) {
            this.ok(regExp.test(err.message), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
    }
    throwsAsync(fn, errType, regExp, message) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            let err;
            try {
                yield fn();
            }
            catch (ex) {
                err = ex;
            }
            this.assertError(err, errType, regExp, message);
        });
    }
    throws(fn, errType, regExp, message) {
        let err;
        try {
            fn();
        }
        catch (ex) {
            err = ex;
        }
        this.assertError(err, errType, regExp, message);
    }
    assertNotHandledErrors() {
        if (Assert.errors.length) {
            const firstError = Assert.errors[0];
            Assert.errors = [];
            throw firstError;
        }
    }
    // noinspection JSMethodCanBeStatic
    throwAssertionError(actual, expected, message) {
        console.debug('actual: ', actual);
        console.debug('expected: ', expected);
        const error = new AssertionError(message, {
            actual,
            expected,
            showDiff: true,
        });
        if (!Assert.errors) {
            Assert.errors = [error];
        }
        else {
            Assert.errors.push(error);
        }
        throw error;
    }
}
Assert.errors = [];
const assert = new Assert();

exports.Assert = Assert;
exports.AssertionError = AssertionError;
exports.assert = assert;
