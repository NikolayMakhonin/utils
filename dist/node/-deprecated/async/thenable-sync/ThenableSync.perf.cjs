'use strict';

var tslib = require('tslib');
var calcPerformanceAsync = require('../../../calcPerformanceAsync.cjs');
var ThenableSync = require('../../../ThenableSync.cjs');
require('rdtsc');
require('../../../async.cjs');
require('../../../helpers.cjs');

describe('thenable-sync > ThenableSync perf', function () {
    this.timeout(600000);
    it('base', function () {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const thenableSync = ThenableSync.ThenableSync.createResolved('thenableSync');
            function* funcGenerator() {
                // for (let i = 0; i < 20; i++) {
                //   yield thenableSync
                // }
                return thenableSync;
            }
            function runThenableSync() {
                return ThenableSync.resolveAsync(funcGenerator());
            }
            const promise = Promise.resolve('promise');
            function runPromise() {
                return tslib.__awaiter(this, void 0, void 0, function* () {
                    // for (let i = 0; i < 20; i++) {
                    //   await promise
                    // }
                    return promise;
                });
            }
            assert.strictEqual(yield runThenableSync(), 'thenableSync');
            assert.strictEqual(yield runPromise(), 'promise');
            let result = yield calcPerformanceAsync.calcPerformanceAsync(10000, () => {
            }, () => {
                return runThenableSync();
            }, () => {
                return runPromise();
            });
            console.log(result);
        });
    });
});
