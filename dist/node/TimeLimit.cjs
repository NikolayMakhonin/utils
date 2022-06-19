'use strict';

var tslib = require('tslib');
var CustomPromise = require('./CustomPromise.cjs');
var promiseToAbortable = require('./promiseToAbortable.cjs');
var timeControllerDefault = require('./timeControllerDefault.cjs');

class TimeLimit {
    constructor({ maxCount, timeMs, priorityQueue, timeController, }) {
        this._activeCount = 0;
        this._tickPromise = new CustomPromise.CustomPromise();
        this._timeController = timeController || timeControllerDefault.timeControllerDefault;
        this._maxCount = maxCount;
        this._timeMs = timeMs;
        this._priorityQueue = priorityQueue;
        this._releaseFunc = () => {
            this._release();
        };
        this._tickFunc = (abortSignal) => this.tick(abortSignal);
    }
    _release() {
        this._activeCount--;
        const tickPromise = this._tickPromise;
        this._tickPromise = new CustomPromise.CustomPromise();
        tickPromise.resolve();
    }
    tick(abortSignal) {
        return promiseToAbortable.promiseToAbortable(this._tickPromise.promise, abortSignal);
    }
    available() {
        return this._activeCount < this._maxCount;
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
            this._activeCount++;
            try {
                const result = yield func(abortSignal);
                return result;
            }
            finally {
                this._timeController.setTimeout(this._releaseFunc, this._timeMs);
            }
        });
    }
}

exports.TimeLimit = TimeLimit;
