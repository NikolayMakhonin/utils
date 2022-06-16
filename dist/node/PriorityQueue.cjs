'use strict';

var tslib = require('tslib');
var PairingHeap = require('./PairingHeap.cjs');
var CustomPromise = require('./CustomPromise.cjs');
var Priority = require('./Priority.cjs');
var promiseToAbortable = require('./promiseToAbortable.cjs');

const emptyFunc = () => { };
function queueItemLessThan(o1, o2) {
    return Priority.priorityCompare(o1.priority, o2.priority) < 0;
}
class PriorityQueue {
    constructor({ objectPool, } = {}) {
        this._queue = new PairingHeap.PairingHeap({
            objectPool,
            lessThanFunc: queueItemLessThan,
        });
    }
    run(func, priority, abortSignal) {
        const promise = new CustomPromise.CustomPromise();
        this._queue.add({
            priority,
            func,
            abortSignal,
            resolve: promise.resolve,
            reject: promise.reject,
        });
        void this._process();
        return promiseToAbortable.promiseToAbortable(promise.promise, abortSignal);
    }
    _process() {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (this._processRunning) {
                return;
            }
            this._processRunning = true;
            while (true) {
                yield Promise.resolve().then(emptyFunc);
                if (this._queue.isEmpty) {
                    break;
                }
                const item = this._queue.deleteMin();
                try {
                    const result = item.func && (yield item.func(item.abortSignal));
                    item.resolve(result);
                }
                catch (err) {
                    item.reject(err);
                }
            }
            this._processRunning = false;
        });
    }
}

exports.PriorityQueue = PriorityQueue;
exports.queueItemLessThan = queueItemLessThan;
