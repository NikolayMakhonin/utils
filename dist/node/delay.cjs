'use strict';

function delay(milliseconds, abortSignal) {
    return new Promise((resolve, reject) => {
        if (abortSignal && abortSignal.aborted) {
            reject(abortSignal.reason);
            return;
        }
        let unsubscribe;
        function onResolve() {
            if (unsubscribe) {
                unsubscribe();
            }
            resolve();
        }
        const timer = setTimeout(onResolve, milliseconds);
        if (abortSignal) {
            unsubscribe = abortSignal.subscribe((reason) => {
                clearTimeout(timer);
                reject(reason);
            });
        }
    });
}

exports.delay = delay;
