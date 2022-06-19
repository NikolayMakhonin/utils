'use strict';

var helpers = require('./helpers.cjs');

function isThenable(value) {
    return value != null
        && typeof value === 'object'
        && typeof value.then === 'function';
}
function isAsync(value) {
    return isThenable(value) || helpers.isIterator(value);
}
exports.ResolveResult = void 0;
(function (ResolveResult) {
    ResolveResult[ResolveResult["None"] = 0] = "None";
    ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
    ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
    ResolveResult[ResolveResult["Error"] = 4] = "Error";
    ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
    ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(exports.ResolveResult || (exports.ResolveResult = {}));
class CombinedStateProvider {
    constructor() {
        this._stateProviders = [];
        this._stateProvidersWereUsed = false;
    }
    registerStateProvider(stateProvider) {
        if (this._stateProvidersWereUsed) {
            throw new Error('You should add state provider only before using them');
        }
        if (this._stateProviders.includes(stateProvider)) {
            throw new Error('stateProvider already registered');
        }
        this._stateProviders.push(stateProvider);
    }
    getState() {
        this._stateProvidersWereUsed = true;
        const len = this._stateProviders.length;
        if (len === 0) {
            return null;
        }
        if (len === 1) {
            return this._stateProviders[0].getState();
        }
        const states = [];
        for (let i = 0; i < len; i++) {
            states[i] = this._stateProviders[i].getState();
        }
        return states;
    }
    setState(state) {
        if (!this._stateProvidersWereUsed) {
            return;
        }
        const len = this._stateProviders.length;
        if (len === 0) {
            return;
        }
        if (len === 1) {
            this._stateProviders[0].setState(state);
            return;
        }
        if (!Array.isArray(state) || state.length !== len) {
            throw new Error('Unexpected behavior');
        }
        for (let i = 0; i < len; i++) {
            this._stateProviders[i].setState(state[i]);
        }
    }
}
const stateProviderDefault = new CombinedStateProvider();
function registerStateProvider(stateProvider) {
    stateProviderDefault.registerStateProvider(stateProvider);
}
function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
    if (!helpers.isIterator(iterator)) {
        return exports.ResolveResult.None;
    }
    function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
        let _onImmediate;
        let _onDeferred;
        try {
            while (true) {
                let iteratorResult;
                if (isThrow) {
                    isThrow = false;
                    iteratorResult = iterator.throw(nextValue);
                }
                else {
                    iteratorResult = iterator.next(nextValue);
                }
                if (iteratorResult.done) {
                    nextOnImmediate(iteratorResult.value, isError);
                    return isError ? exports.ResolveResult.ImmediateError : exports.ResolveResult.Immediate;
                }
                if (_onImmediate == null) {
                    _onImmediate = __onImmediate;
                }
                if (_onDeferred == null) {
                    _onDeferred = (o, nextIsError) => {
                        iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
                    };
                }
                const result = _resolveValue(iteratorResult.value, false, _onImmediate, _onDeferred, customResolveValue);
                if ((result & exports.ResolveResult.Deferred) !== 0) {
                    return result;
                }
            }
        }
        catch (err) {
            nextOnImmediate(err, true);
            return exports.ResolveResult.ImmediateError;
        }
        function __onImmediate(o, nextIsError) {
            nextValue = o;
            isThrow = nextIsError;
        }
    }
    return iterate(void 0, false, onImmediate, onDeferred);
}
function resolveThenable(thenable, isError, onImmediate, onDeferred) {
    if (!isThenable(thenable)) {
        return exports.ResolveResult.None;
    }
    let result = isError ? exports.ResolveResult.DeferredError : exports.ResolveResult.Deferred;
    let deferred;
    const _onfulfilled = value => {
        if (deferred) {
            onDeferred(value, isError);
        }
        else {
            result = isError ? exports.ResolveResult.ImmediateError : exports.ResolveResult.Immediate;
            onImmediate(value, isError);
        }
    };
    const _onrejected = err => {
        if (deferred) {
            onDeferred(err, true);
        }
        else {
            result = exports.ResolveResult.ImmediateError;
            onImmediate(err, true);
        }
    };
    if (thenable.thenLast != null) {
        thenable.thenLast(_onfulfilled, _onrejected);
    }
    else {
        thenable.then(_onfulfilled, _onrejected);
    }
    deferred = true;
    return result;
}
function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue, callState) {
    const prevCallState = stateProviderDefault.getState();
    if (callState == null) {
        callState = prevCallState;
    }
    else {
        stateProviderDefault.setState(callState);
    }
    try {
        const nextOnImmediate = (o, nextIsError) => {
            if (nextIsError) {
                isError = true;
            }
            value = o;
        };
        const nextOnDeferred = (val, nextIsError) => {
            _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue, callState);
        };
        let iterations = 0;
        while (true) {
            iterations++;
            if (iterations > 1000) {
                throw new Error('_resolveAsync infinity loop');
            }
            {
                const result = resolveThenable(value, isError, nextOnImmediate, nextOnDeferred);
                if ((result & exports.ResolveResult.Deferred) !== 0) {
                    return result;
                }
                if ((result & exports.ResolveResult.Immediate) !== 0) {
                    continue;
                }
            }
            {
                const result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred, customResolveValue);
                if ((result & exports.ResolveResult.Deferred) !== 0) {
                    return result;
                }
                if ((result & exports.ResolveResult.Immediate) !== 0) {
                    continue;
                }
            }
            if (value != null && customResolveValue != null) {
                const newValue = customResolveValue(value);
                if (!helpers.equals(newValue, value)) {
                    value = newValue;
                    continue;
                }
            }
            onImmediate(value, isError);
            return isError ? exports.ResolveResult.ImmediateError : exports.ResolveResult.Immediate;
        }
    }
    finally {
        stateProviderDefault.setState(prevCallState);
    }
}
function resolveValue(value, onImmediate, onDeferred, customResolveValue) {
    return _resolveValue(value, false, onImmediate, onDeferred, customResolveValue);
}
function resolveValueFunc(func, onImmediate, onDeferred, customResolveValue) {
    try {
        return resolveValue(func(), onImmediate, onDeferred, customResolveValue);
    }
    catch (err) {
        onImmediate(err, true);
        return exports.ResolveResult.ImmediateError;
    }
}

exports.isAsync = isAsync;
exports.isThenable = isThenable;
exports.registerStateProvider = registerStateProvider;
exports.resolveValue = resolveValue;
exports.resolveValueFunc = resolveValueFunc;
exports.stateProviderDefault = stateProviderDefault;
