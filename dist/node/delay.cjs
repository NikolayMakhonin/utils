'use strict';

var timeControllerDefault = require('./timeControllerDefault.cjs');

function delay(milliseconds, abortSignal, timeController) {
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
        const _timeController = timeController || timeControllerDefault.timeControllerDefault;
        const handle = _timeController.setTimeout(onResolve, milliseconds);
        if (abortSignal) {
            unsubscribe = abortSignal.subscribe((reason) => {
                _timeController.clearTimeout(handle);
                reject(reason);
            });
        }
    });
}

exports.delay = delay;
