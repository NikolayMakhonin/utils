'use strict';

class CustomPromise {
    constructor() {
        let resolve;
        let reject;
        this.promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
        this.resolve = resolve;
        this.reject = reject;
    }
}

exports.CustomPromise = CustomPromise;
