'use strict';

var tslib = require('tslib');
var CustomPromise = require('./CustomPromise.cjs');

class TimeLimits {
    constructor({ timeLimits, priorityQueue, }) {
        this._timeLimits = timeLimits;
        this._priorityQueue = priorityQueue;
        this._tickFunc = (abortSignal) => this.tick(abortSignal);
    }
    tick(abortSignal) {
        return Promise.race(this._timeLimits.map(o => o.tick(abortSignal)));
    }
    available() {
        return this._timeLimits.every(o => o.available());
    }
    run(func, priority, abortSignal) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (this._priorityQueue) {
                yield this._priorityQueue.run(null, priority, abortSignal);
            }
            while (!this.available()) {
                if (this._priorityQueue) {
                    yield this._priorityQueue.run(this._tickFunc, priority, abortSignal);
                }
                else {
                    yield this.tick(abortSignal);
                }
            }
            const waitPromise = new CustomPromise.CustomPromise();
            const waitFunc = () => waitPromise.promise;
            for (let i = 0; i < this._timeLimits.length; i++) {
                void this._timeLimits[i].run(waitFunc);
            }
            try {
                const result = yield func(abortSignal);
                return result;
            }
            finally {
                waitPromise.resolve();
            }
        });
    }
}

exports.TimeLimits = TimeLimits;
