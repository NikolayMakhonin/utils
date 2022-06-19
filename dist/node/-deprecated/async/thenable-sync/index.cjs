'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ThenableSync = require('../../../ThenableSync.cjs');
var async = require('../../../async.cjs');
var helpers = require('../../../helpers.cjs');



exports.ThenableSync = ThenableSync.ThenableSync;
exports.resolveAsync = ThenableSync.resolveAsync;
exports.resolveAsyncAll = ThenableSync.resolveAsyncAll;
exports.resolveAsyncAny = ThenableSync.resolveAsyncAny;
exports.resolveAsyncFunc = ThenableSync.resolveAsyncFunc;
exports.isAsync = async.isAsync;
exports.isThenable = async.isThenable;
exports.equals = helpers.equals;
exports.isIterable = helpers.isIterable;
exports.isIterator = helpers.isIterator;
