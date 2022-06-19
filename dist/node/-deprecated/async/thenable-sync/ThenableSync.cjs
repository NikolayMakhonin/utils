'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ThenableSync = require('../../../ThenableSync.cjs');
require('../../../async.cjs');
require('../../../helpers.cjs');



exports.ThenableSync = ThenableSync.ThenableSync;
Object.defineProperty(exports, 'ThenableSyncStatus', {
	enumerable: true,
	get: function () { return ThenableSync.ThenableSyncStatus; }
});
exports.createRejected = ThenableSync.createRejected;
exports.createResolved = ThenableSync.createResolved;
exports.resolveAsync = ThenableSync.resolveAsync;
exports.resolveAsyncAll = ThenableSync.resolveAsyncAll;
exports.resolveAsyncAny = ThenableSync.resolveAsyncAny;
exports.resolveAsyncFunc = ThenableSync.resolveAsyncFunc;
