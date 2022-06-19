'use strict';

var async = require('./async.cjs');

/* eslint-disable @typescript-eslint/no-throw-literal */
exports.ThenableSyncStatus = void 0;
(function (ThenableSyncStatus) {
    ThenableSyncStatus["Resolving"] = "Resolving";
    ThenableSyncStatus["Resolved"] = "Resolved";
    ThenableSyncStatus["Rejected"] = "Rejected";
})(exports.ThenableSyncStatus || (exports.ThenableSyncStatus = {}));
function createResolved(value, customResolveValue) {
    const thenable = new ThenableSync(null, customResolveValue);
    thenable.resolve(value);
    return thenable;
}
function createRejected(error, customResolveValue) {
    const thenable = new ThenableSync(null, customResolveValue);
    thenable.reject(error);
    return thenable;
}
class ThenableSync {
    constructor(executor, customResolveValue) {
        this._onfulfilled = null;
        this._onrejected = null;
        this._value = void 0;
        this._error = null;
        this._status = null;
        this._customResolveValue = customResolveValue;
        if (executor) {
            try {
                const _this = this;
                executor(function resolve() {
                    _this.resolve.apply(_this, arguments);
                }, function reject() {
                    _this.reject.apply(_this, arguments);
                });
            }
            catch (err) {
                this.reject(err);
            }
        }
    }
    // region resolve
    resolve(value) {
        if (this._status != null) {
            throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
        }
        this._resolve(value);
    }
    _resolve(value) {
        const { _status } = this;
        if (_status != null && _status !== exports.ThenableSyncStatus.Resolving) {
            throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
        }
        const result = async.resolveValue(value, (o, e) => {
            if (e) {
                this._reject(o);
            }
            else {
                this.__resolve(o);
            }
        }, (o, e) => {
            if (e) {
                this._reject(o);
            }
            else {
                this._resolve(o);
            }
        }, this._customResolveValue);
        if ((result & async.ResolveResult.Deferred) !== 0) {
            this._status = exports.ThenableSyncStatus.Resolving;
            return;
        }
        if ((result & async.ResolveResult.Error) !== 0) {
            return;
        }
    }
    __resolve(value) {
        this._status = exports.ThenableSyncStatus.Resolved;
        this._value = value;
        const { _onfulfilled } = this;
        if (_onfulfilled) {
            this._onfulfilled = void 0;
            this._onrejected = void 0;
            for (let i = 0, len = _onfulfilled.length; i < len; i++) {
                _onfulfilled[i](value);
            }
        }
    }
    // endregion
    // region reject
    reject(error) {
        if (this._status != null) {
            throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
        }
        this._reject(error);
    }
    _reject(error) {
        const { _status } = this;
        if (_status != null && _status !== exports.ThenableSyncStatus.Resolving) {
            throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
        }
        const result = async.resolveValue(error, o => {
            this.__reject(o);
        }, o => {
            this._reject(o);
        }, this._customResolveValue);
        if ((result & async.ResolveResult.Deferred) !== 0) {
            this._status = exports.ThenableSyncStatus.Resolving;
            return;
        }
    }
    __reject(error) {
        this._status = exports.ThenableSyncStatus.Rejected;
        this._error = error;
        const { _onrejected } = this;
        if (_onrejected) {
            this._onfulfilled = void 0;
            this._onrejected = void 0;
            for (let i = 0, len = _onrejected.length; i < len; i++) {
                void _onrejected[i](error);
            }
        }
    }
    // endregion
    // region then
    _then(onfulfilled, onrejected, lastExpression, customResolveValue) {
        const reject = error => {
            if (!onrejected) {
                if (lastExpression) {
                    throw error;
                }
                return createRejected(error, customResolveValue);
            }
            let isError;
            try {
                error = onrejected(error);
            }
            catch (err) {
                isError = true;
                error = err;
            }
            const result = resolveAsync(error, null, null, !lastExpression, customResolveValue, isError);
            return result;
        };
        switch (this._status) {
            case exports.ThenableSyncStatus.Resolved: {
                let { _value } = this;
                if (!onfulfilled) {
                    return lastExpression
                        ? _value
                        : this;
                }
                let isError;
                try {
                    _value = onfulfilled(_value);
                }
                catch (err) {
                    isError = true;
                    _value = err;
                }
                if (isError) {
                    const result = resolveAsync(_value, null, null, !lastExpression, customResolveValue);
                    if (async.isThenable(result)) {
                        return result.then(reject, onrejected);
                    }
                    return reject(result);
                }
                const result = resolveAsync(_value, null, onrejected, !lastExpression, customResolveValue);
                return lastExpression || async.isThenable(result)
                    ? result
                    : createResolved(result, customResolveValue);
            }
            case exports.ThenableSyncStatus.Rejected:
                if (!onrejected && !lastExpression && (!customResolveValue || customResolveValue === this._customResolveValue)) {
                    return this;
                }
                return reject(this._error);
            default: {
                if (!onfulfilled && !onrejected && (!customResolveValue || customResolveValue === this._customResolveValue)) {
                    return this;
                }
                const result = new ThenableSync(null, customResolveValue);
                let { _onrejected } = this;
                if (!_onrejected) {
                    this._onrejected = _onrejected = [];
                }
                const callState = async.stateProviderDefault.getState();
                const rejected = onrejected
                    ? (value) => {
                        let isError;
                        const prevState = async.stateProviderDefault.getState();
                        try {
                            async.stateProviderDefault.setState(callState);
                            value = onrejected(value);
                        }
                        catch (err) {
                            isError = true;
                            value = err;
                        }
                        finally {
                            async.stateProviderDefault.setState(prevState);
                        }
                        if (isError) {
                            result.reject(value);
                        }
                        else {
                            result.resolve(value);
                        }
                    }
                    : (value) => {
                        result.reject(value);
                    };
                _onrejected.push(rejected);
                let { _onfulfilled } = this;
                if (!_onfulfilled) {
                    this._onfulfilled = _onfulfilled = [];
                }
                _onfulfilled.push(onfulfilled
                    ? (value) => {
                        let isError;
                        const prevState = async.stateProviderDefault.getState();
                        try {
                            async.stateProviderDefault.setState(callState);
                            value = onfulfilled(value);
                        }
                        catch (err) {
                            isError = true;
                            value = err;
                        }
                        finally {
                            async.stateProviderDefault.setState(prevState);
                        }
                        if (isError) {
                            async.resolveValue(value, rejected, rejected, customResolveValue);
                        }
                        else {
                            result.resolve(value);
                        }
                    }
                    : (value) => {
                        result.resolve(value);
                    });
                return result;
            }
        }
    }
    then(onfulfilled, onrejected, customResolveValue) {
        return this._then(onfulfilled, onrejected, false, customResolveValue === false ? null : (customResolveValue || this._customResolveValue));
    }
    thenLast(onfulfilled, onrejected, customResolveValue) {
        return this._then(onfulfilled, onrejected, true, customResolveValue === false ? null : (customResolveValue || this._customResolveValue));
    }
}
// endregion
// region static helpers
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = async.isThenable;
ThenableSync.resolve = resolveAsync;
function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue, isError) {
    // Optimization
    if (!isError && !onfulfilled && !async.isAsync(input)) {
        if (input != null && customResolveValue) {
            const newInput = customResolveValue(input);
            if (input === newInput) {
                return input;
            }
            input = newInput;
        }
        else {
            return input;
        }
    }
    return _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue, isError);
}
function _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue, isError) {
    let result;
    let onResult = (o, e) => {
        result = o;
        isError = isError || e;
    };
    let thenable;
    const createThenable = () => {
        if (!thenable) {
            thenable = new ThenableSync((resolve, reject) => {
                onResult = (o, e) => {
                    if (isError || e) {
                        reject(o);
                        return;
                    }
                    resolve(o);
                };
            }, customResolveValue);
        }
        return thenable;
    };
    const resolveOnResult = (o, e) => {
        const handler = isError || e ? onrejected : onfulfilled;
        if (handler) {
            isError = false;
            if ((async.resolveValueFunc(() => {
                return handler(o);
            }, (o2, e2) => {
                onResult(o2, e2);
            }, (o2, e2) => {
                onResult(o2, e2);
            }, customResolveValue) & async.ResolveResult.Deferred) !== 0) {
                result = createThenable();
            }
        }
        else {
            onResult(o, e);
        }
    };
    const res = async.resolveValue(input, resolveOnResult, resolveOnResult, customResolveValue);
    if ((res & async.ResolveResult.Deferred) !== 0) {
        return createThenable();
    }
    if (isError) {
        if (dontThrowOnImmediateError) {
            return createRejected(result, customResolveValue);
        }
        throw result;
    }
    return result;
}
function resolveAsyncFunc(func, onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue) {
    try {
        return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue);
    }
    catch (err) {
        return resolveAsync(err, onrejected, onrejected, dontThrowOnImmediateReject, customResolveValue, true);
    }
}
function* _resolveAsyncAll(inputPrepared) {
    const len = inputPrepared.length;
    for (let i = 0; i < len; i++) {
        inputPrepared[i] = yield inputPrepared[i];
    }
    return inputPrepared;
}
function resolveAsyncAll(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
    let resolved = true;
    const inputPrepared = input.map(o => {
        const item = resolveAsync(o, null, null, true, customResolveValue);
        if (resolved && async.isThenable(item)) {
            resolved = false;
        }
        return item;
    });
    return resolveAsync(resolved
        ? inputPrepared
        : _resolveAsyncAll(inputPrepared)[Symbol.iterator](), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}
function resolveAsyncAny(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
    const len = input.length;
    const inputPrepared = new Array(len);
    for (let i = 0; i < len; i++) {
        const item = resolveAsync(input[i], null, null, true, customResolveValue);
        if (!async.isThenable(item)) {
            return resolveAsync(item, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
        }
        inputPrepared[i] = item;
    }
    return resolveAsync(new ThenableSync((resolve, reject) => {
        inputPrepared.forEach(o => o.then(resolve, reject));
    }), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}

exports.ThenableSync = ThenableSync;
exports.createRejected = createRejected;
exports.createResolved = createResolved;
exports.resolveAsync = resolveAsync;
exports.resolveAsyncAll = resolveAsyncAll;
exports.resolveAsyncAny = resolveAsyncAny;
exports.resolveAsyncFunc = resolveAsyncFunc;
