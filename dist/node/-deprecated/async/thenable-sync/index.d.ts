import { ThenableOrIteratorOrValue as _ThenableOrIteratorOrValue, ThenableOrValue as _ThenableOrValue, ThenableIterator as _ThenableIterator } from './async';
export { ThenableSync, resolveAsync, resolveAsyncFunc, resolveAsyncAll, resolveAsyncAny } from './ThenableSync';
export { isAsync, isThenable } from './async';
export { equals, isIterator, isIterable } from './helpers';
export declare type ThenableOrIteratorOrValue<T> = _ThenableOrIteratorOrValue<T>;
export declare type ThenableIterator<T> = _ThenableIterator<T>;
export declare type ThenableOrValue<T> = _ThenableOrValue<T>;
