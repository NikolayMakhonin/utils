'use strict';

function promiseToAbortable(promise, abortSignal) {
    return new Promise((resolve, reject) => {
        if (abortSignal && abortSignal.aborted) {
            reject(abortSignal.reason);
            return;
        }
        let unsubscribe;
        function onResolve(value) {
            if (unsubscribe) {
                unsubscribe();
            }
            resolve(value);
        }
        promise
            .then(onResolve)
            .catch(reject);
        if (abortSignal) {
            unsubscribe = abortSignal.subscribe(reject);
        }
    });
}

exports.promiseToAbortable = promiseToAbortable;
