'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var async = require('../../../async.cjs');
require('../../../helpers.cjs');



Object.defineProperty(exports, 'ResolveResult', {
	enumerable: true,
	get: function () { return async.ResolveResult; }
});
exports.isAsync = async.isAsync;
exports.isThenable = async.isThenable;
exports.registerStateProvider = async.registerStateProvider;
exports.resolveValue = async.resolveValue;
exports.resolveValueFunc = async.resolveValueFunc;
exports.stateProviderDefault = async.stateProviderDefault;
