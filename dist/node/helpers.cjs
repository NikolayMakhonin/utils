'use strict';

function equals(v1, v2) {
    return v1 === v2
        // is NaN
        // eslint-disable-next-line no-self-compare
        || v1 !== v1 && v2 !== v2;
}
function isIterable(value) {
    return value != null
        && typeof value === 'object'
        && (Array.isArray(value)
            || !(value instanceof String)
                && typeof value[Symbol.iterator] === 'function');
}
function isIterator(value) {
    return isIterable(value)
        && typeof value.next === 'function';
}

exports.equals = equals;
exports.isIterable = isIterable;
exports.isIterator = isIterator;
