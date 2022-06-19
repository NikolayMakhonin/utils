'use strict';

var async = require('./async.cjs');
var ThenableSync = require('./ThenableSync.cjs');
var helpers = require('./helpers.cjs');
var Assert = require('./Assert.cjs');
var TestVariants = require('./TestVariants.cjs');

/* eslint-disable @typescript-eslint/no-loop-func */
exports.ValueType = void 0;
(function (ValueType) {
    ValueType["Value"] = "Value";
    ValueType["ThenableResolved"] = "ThenableResolved";
    ValueType["ThenableRejected"] = "ThenableRejected";
    ValueType["ThenableThrowed"] = "ThenableThrowed";
    ValueType["ThenableResolve"] = "ThenableResolve";
    ValueType["ThenableReject"] = "ThenableReject";
    ValueType["Iterator"] = "Iterator";
    ValueType["IteratorThrow"] = "IteratorThrow";
})(exports.ValueType || (exports.ValueType = {}));
exports.ThenType = void 0;
(function (ThenType) {
    // ResolveValue = 'ResolveValue',
    ThenType["Then"] = "Then";
    ThenType["ThenLast"] = "ThenLast";
    // ResolveAsync,
})(exports.ThenType || (exports.ThenType = {}));
function resolveOptionValue(opts, value) {
    if (typeof value === 'function' && !(value instanceof Error)) {
        value = value(opts);
    }
    return value;
}
function resolveOptions(optionsSource, optionsParams) {
    const resolvedOptions = Object.assign({}, optionsSource);
    for (const key in resolvedOptions) {
        if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
            resolvedOptions[key] = key === 'action' || key === 'value'
                ? resolvedOptions[key]
                : resolveOptionValue(optionsParams || resolvedOptions, resolvedOptions[key]);
        }
    }
    resolvedOptions.expected = {};
    for (const key in optionsSource.expected) {
        if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
            resolvedOptions.expected[key] =
                resolveOptionValue(optionsParams || resolvedOptions, optionsSource.expected[key]);
        }
    }
    return resolvedOptions;
}
const OBJ = {};
const THEN_LIKE = { then: onfulfill => {
        onfulfill('THEN_LIKE');
    } };
const FUNC = () => { };
const ITERABLE = new Set();
const ITERATOR_GENERATOR = function* () {
    yield OBJ;
    return ITERABLE;
};
function createIterator(value, isThrow) {
    const iteratorInner = function* () {
        Assert.assert.strictEqual(yield void 0, void 0);
        Assert.assert.strictEqual(yield null, null);
        Assert.assert.strictEqual(yield false, false);
        Assert.assert.strictEqual(yield 0, 0);
        Assert.assert.strictEqual(yield '', '');
        Assert.assert.strictEqual(yield OBJ, OBJ);
        Assert.assert.strictEqual(yield FUNC, FUNC);
        // assert.strictEqual(yield THEN_LIKE, 'THEN_LIKE')
        Assert.assert.strictEqual(yield ITERABLE, ITERABLE);
        Assert.assert.strictEqual(yield ITERATOR_GENERATOR(), ITERABLE);
        if (isThrow) {
            throw value;
        }
        return value;
    };
    const iterator = (function* () {
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(void 0)), void 0);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(null)), null);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(false)), false);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(0)), 0);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve('')), '');
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(OBJ)), OBJ);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(FUNC)), FUNC);
        // assert.strictEqual(yield new ThenableSync(resolve => resolve(THEN_LIKE)), 'THEN_LIKE')
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(ITERABLE)), ITERABLE);
        Assert.assert.strictEqual(yield new ThenableSync.ThenableSync(resolve => resolve(ITERATOR_GENERATOR())), ITERABLE);
        const result = yield iteratorInner();
        return result;
    })();
    return iterator;
}
function createThenable(useExecutor) {
    if (useExecutor) {
        let resultResolve = null;
        let resultReject = null;
        const thenable = new ThenableSync.ThenableSync((resolve, reject) => {
            resultResolve = resolve;
            resultReject = reject;
        });
        Assert.assert.ok(resultResolve);
        Assert.assert.ok(resultReject);
        return [thenable, resultResolve, resultReject];
    }
    const thenable = new ThenableSync.ThenableSync();
    return [thenable, thenable.resolve.bind(thenable), thenable.reject.bind(thenable)];
}
function createValue(value, getValueType, addResolve, valueInfo) {
    if (!valueInfo) {
        valueInfo = {
            origValue: value,
            immediate: true,
            useReject: false,
        };
    }
    for (let i = 0; i < 2; i++) {
        switch (getValueType(i)) {
            case exports.ValueType.Value:
                break;
            case exports.ValueType.ThenableResolved: {
                const [thenable, resolve, reject] = createThenable(i % 2 === 0);
                resolve(value);
                value = thenable;
                break;
            }
            case exports.ValueType.ThenableRejected: {
                const [thenable, resolve, reject] = createThenable(i % 2 === 0);
                reject(value);
                value = thenable;
                valueInfo.useReject = true;
                break;
            }
            case exports.ValueType.ThenableThrowed: {
                const thenable = new ThenableSync.ThenableSync(() => {
                    throw value;
                });
                value = thenable;
                valueInfo.useReject = true;
                break;
            }
            case exports.ValueType.ThenableResolve: {
                const [thenable, resolve, reject] = createThenable(i % 2 === 0);
                const val = value;
                addResolve(() => resolve(val));
                value = thenable;
                valueInfo.immediate = false;
                break;
            }
            case exports.ValueType.ThenableReject: {
                const [thenable, resolve, reject] = createThenable(i % 2 === 0);
                const val = value;
                addResolve(() => reject(val));
                value = thenable;
                valueInfo.useReject = true;
                valueInfo.immediate = false;
                break;
            }
            case exports.ValueType.Iterator: {
                value = createIterator(value, false);
                break;
            }
            case exports.ValueType.IteratorThrow: {
                valueInfo.throw = true;
                valueInfo.useReject = true;
                value = createIterator(value, true);
                break;
            }
            default:
                throw new Error('Unexpected behavior');
        }
    }
    valueInfo.value = value;
    return valueInfo;
}
function createThen(valueInfo, getValueType, addResolve, getThenType, getThenThrow) {
    const createThenValue = val => {
        return createValue(val, getValueType, addResolve).value;
    };
    const calcValueInfo = valInfo => {
        return createValue(null, getValueType, () => { }, valInfo);
    };
    let thenable = valueInfo.value;
    for (let i = 0; i < 2; i++) {
        switch (getThenType(i)) {
            case exports.ThenType.Then:
                if (async.isThenable(thenable)) {
                    if (getThenThrow(i)) {
                        if (valueInfo.useReject) {
                            calcValueInfo(valueInfo);
                            thenable = thenable.then(null, o => {
                                throw createThenValue(o);
                            });
                        }
                        else {
                            valueInfo.useReject = true;
                            calcValueInfo(valueInfo);
                            thenable = thenable.then(o => {
                                throw createThenValue(o);
                            }, null);
                        }
                    }
                    else if (valueInfo.useReject) {
                        valueInfo.useReject = false;
                        calcValueInfo(valueInfo);
                        thenable = thenable.then(null, o => createThenValue(o));
                    }
                    else {
                        calcValueInfo(valueInfo);
                        thenable = thenable.then(o => createThenValue(o), null);
                    }
                }
                break;
            case exports.ThenType.ThenLast:
                try {
                    if (async.isThenable(thenable)) {
                        if (getThenThrow(i)) {
                            if (valueInfo.useReject) {
                                calcValueInfo(valueInfo);
                                thenable = thenable.thenLast(null, o => {
                                    throw createThenValue(o);
                                });
                            }
                            else {
                                valueInfo.useReject = true;
                                calcValueInfo(valueInfo);
                                thenable = thenable.thenLast(o => {
                                    throw createThenValue(o);
                                }, null);
                            }
                        }
                        else if (valueInfo.useReject) {
                            valueInfo.useReject = false;
                            calcValueInfo(valueInfo);
                            thenable = thenable.thenLast(null, o => createThenValue(o));
                        }
                        else {
                            calcValueInfo(valueInfo);
                            thenable = thenable.thenLast(o => createThenValue(o), null);
                        }
                    }
                }
                catch (err) {
                    if (err instanceof Error) {
                        throw err;
                    }
                    Assert.assert.strictEqual(valueInfo.immediate, true);
                    Assert.assert.strictEqual(valueInfo.useReject, true);
                    Assert.assert.strictEqual(async.isThenable(err), false);
                    Assert.assert.strictEqual(helpers.isIterator(err), false);
                    valueInfo.throw = false;
                    valueInfo.useReject = false;
                    thenable = err;
                }
                break;
            // case ThenType.ResolveValue:
            // 	try {
            // 		if (calcValueInfo(null).throw && (!valueInfo.immediate || !calcValueInfo(null).immediate)) {
            // 			break
            // 		}
            // 		const [newThenable, resolve, reject] = createThenable(i % 2 === 0)
            // 		if (getThenThrow(i)) {
            // 			if (valueInfo.useReject) {
            // 				if (!valueInfo.immediate || !calcValueInfo(null).immediate) {
            // 					break
            // 				}
            // 				calcValueInfo(valueInfo)
            // 				thenResolveValue(thenable, null, o => { throw createThenValue(o) }, true)
            // 			} else {
            // 				valueInfo.useReject = true
            // 				calcValueInfo(valueInfo)
            // 				thenResolveValue(thenable, o => { throw createThenValue(o) }, reject, true)
            // 			}
            // 		} else {
            // 			if (valueInfo.useReject) {
            // 				// valueInfo.useReject = false
            // 				calcValueInfo(valueInfo)
            // 				thenResolveValue(thenable, null, o => { reject(createThenValue(o)) }, true)
            // 			} else {
            // 				calcValueInfo(valueInfo)
            // 				thenResolveValue(thenable, o => { resolve(createThenValue(o)) }, null, false)
            // 			}
            // 		}
            // 		thenable = newThenable
            // 	} catch (err) {
            // 		if (err instanceof Error) {
            // 			throw err
            // 		}
            // 		assert.strictEqual(valueInfo.useReject, true)
            // 		if (!valueInfo.throw) {
            // 			assert.strictEqual(valueInfo.immediate, true)
            // 			assert.strictEqual(isThenable(err), false)
            // 			assert.strictEqual(isIterator(err), false)
            // 		}
            // 		if (isThenable(err) || isIterator(err)) {
            // 			thenable = ThenableSync.createRejected(err)
            // 		} else {
            // 			valueInfo.throw = false
            // 			valueInfo.useReject = false
            // 			thenable = err
            // 		}
            // 	}
            // 	break
            // case ThenType.ResolveAsync:
            // 	break
            default:
                throw new Error(`Unknown ThenType: ${getThenType(i)}`);
        }
    }
    valueInfo.value = thenable;
}
class TestThenableSync extends TestVariants.TestVariants {
    constructor() {
        super();
        this.baseOptionsVariants = {
            value: ['v'],
            createValue0: Object.values(exports.ValueType),
            thenValue0: Object.values(exports.ValueType),
            thenThrow0: [false],
            thenType0: Object.values(exports.ThenType),
            createValue1: Object.values(exports.ValueType),
            thenValue1: Object.values(exports.ValueType),
            thenThrow1: [false, true],
            thenType1: Object.values(exports.ThenType),
            // createValue2: Object.values(ValueType),
            // thenValue2: Object.values(ValueType),
            // thenThrow2: [false, true],
            // thenType2: Object.values(ThenType),
        };
    }
    testVariant(inputOptions) {
        let error;
        for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
            let valueInfo;
            try {
                const options = resolveOptions(inputOptions, null);
                const action = () => {
                    const resolveList = [];
                    valueInfo = createValue(options.value, index => options['createValue' + index], resolve => resolveList.push(resolve));
                    createThen(valueInfo, index => options['thenValue' + index], resolve => resolveList.push(resolve), index => options['thenType' + index], index => options['thenThrow' + index]);
                    // region Check
                    let queueSize = 0;
                    const onResult = o => {
                        Assert.assert.ok(queueSize > 0);
                        queueSize--;
                        Assert.assert.strictEqual(o, valueInfo.origValue);
                    };
                    if (valueInfo.useReject) {
                        queueSize++;
                        ThenableSync.ThenableSync.resolve(valueInfo.value, null, onResult, true);
                    }
                    else {
                        queueSize++;
                        ThenableSync.ThenableSync.resolve(valueInfo.value, onResult, null, true);
                    }
                    if (!helpers.isIterator(valueInfo.value)) {
                        if (valueInfo.useReject) {
                            queueSize++;
                            ThenableSync.ThenableSync.resolve(ThenableSync.ThenableSync.resolve(valueInfo.value, onResult, null, true), null, onResult, true);
                        }
                        else {
                            queueSize++;
                            ThenableSync.ThenableSync.resolve(ThenableSync.ThenableSync.resolve(valueInfo.value, null, onResult, true), onResult, null, true);
                        }
                        queueSize++;
                        ThenableSync.ThenableSync.resolve(ThenableSync.ThenableSync.resolve(valueInfo.value, null, null, true), onResult, onResult, true);
                    }
                    if (async.isThenable(valueInfo.value)) {
                        if (valueInfo.useReject) {
                            queueSize++;
                            valueInfo.value
                                .then(onResult, null)
                                .then(null, onResult);
                        }
                        else {
                            queueSize++;
                            valueInfo.value
                                .then(null, onResult)
                                .then(onResult, null);
                        }
                        queueSize++;
                        valueInfo.value
                            .then(null, null)
                            .then(onResult, onResult);
                    }
                    if (valueInfo.immediate) {
                        Assert.assert.strictEqual(queueSize, 0);
                    }
                    else {
                        const checkQueueSize = queueSize;
                        while (resolveList.length) {
                            Assert.assert.strictEqual(queueSize, checkQueueSize);
                            resolveList.shift()();
                        }
                        Assert.assert.strictEqual(queueSize, 0);
                    }
                    // endregion
                };
                if (options.expected.error) {
                    Assert.assert.throws(action, options.expected.error);
                    Assert.assert.ok(false);
                }
                else {
                    action();
                }
                // assert.assertNotHandledErrors()
                break;
            }
            catch (ex) {
                if (!debugIteration) {
                    console.log(`Test number: ${TestThenableSync.totalTests}\r\nError in: ${inputOptions.description}\n`, `${JSON.stringify(valueInfo, null, 4)}\n`, inputOptions, 
                    // ${
                    // JSON.stringify(initialOptions, null, 4)
                    // }
                    `\n${inputOptions.action.toString()}\n${ex && ex.stack}`);
                    error = ex;
                }
            }
            finally {
                TestThenableSync.totalTests++;
            }
        }
        if (error) {
            throw error;
        }
    }
    static test(testCases) {
        if (!testCases.actions) {
            testCases.actions = [() => { }];
        }
        TestThenableSync._instance.test(testCases);
    }
}
TestThenableSync.totalTests = 0;
TestThenableSync._instance = new TestThenableSync();

exports.FUNC = FUNC;
exports.ITERABLE = ITERABLE;
exports.ITERATOR_GENERATOR = ITERATOR_GENERATOR;
exports.OBJ = OBJ;
exports.THEN_LIKE = THEN_LIKE;
exports.TestThenableSync = TestThenableSync;
