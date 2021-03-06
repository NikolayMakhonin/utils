export declare type ThenableOrValue<T> = T | Thenable<T>;
export declare type ThenableOrIterator<T> = ThenableIterator<T> | ThenableOrIteratorOrValueNested<T>;
export declare type IteratorOrValue<T> = ThenableIterator<T> | T;
export declare type ThenableOrIteratorOrValue<T> = T | ThenableOrIterator<T>;
export declare type AsyncValueOf<T> = T extends ThenableOrIterator<infer V> ? V : T;
export declare type ThenableOrIteratorOrValueNested<T> = IThenableOrIteratorOrValueNested<T> | IPromiseLikeOrIteratorOrValueNested<T>;
export interface IThenableOrIteratorOrValueNested<T> extends IThenable<ThenableOrIteratorOrValue<T>> {
}
export interface IPromiseLikeOrIteratorOrValueNested<T> extends PromiseLike<ThenableOrIteratorOrValue<T>> {
}
export interface ThenableIterator<T> extends Iterator<any, ThenableOrIteratorOrValue<T>> {
}
export declare type TResolve<TValue> = (value?: ThenableOrIteratorOrValue<TValue>) => void;
export declare type TReject = (error?: any) => void;
export declare type TResolveAsyncValue<TValue = any, TResult = any> = (value: TValue) => ThenableOrIteratorOrValue<TResult>;
export declare type TOnFulfilled<TValue = any, TResult = any> = (value: TValue) => ThenableOrIteratorOrValue<TResult>;
export declare type TOnRejected<TResult = any> = (error: any) => ThenableOrIteratorOrValue<TResult>;
export interface IThenable<T = any> extends PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: TOnFulfilled<T, TResult1>, onrejected?: TOnRejected<TResult2>): Thenable<TResult1 | TResult2>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}
export declare type Thenable<T = any> = IThenable<T> | PromiseLike<T>;
export declare function isThenable(value: any): boolean;
export declare function isAsync(value: any): boolean;
export declare enum ResolveResult {
    None = 0,
    Immediate = 1,
    Deferred = 2,
    Error = 4,
    ImmediateError = 5,
    DeferredError = 6
}
interface IStateProvider<TState> {
    getState: () => TState;
    setState: (state: TState) => void;
}
declare class CombinedStateProvider implements IStateProvider<any> {
    private readonly _stateProviders;
    private _stateProvidersWereUsed;
    registerStateProvider<TState>(stateProvider: IStateProvider<TState>): void;
    getState(): any;
    setState(state: any): void;
}
export declare const stateProviderDefault: CombinedStateProvider;
export declare function registerStateProvider<TState>(stateProvider: IStateProvider<TState>): void;
export declare function resolveValue<T>(value: ThenableOrIteratorOrValue<T>, onImmediate: (value: T, isError: boolean) => void, onDeferred: (value: T, isError: boolean) => void, customResolveValue?: TResolveAsyncValue<T>): ResolveResult;
export declare function resolveValueFunc<T>(func: () => ThenableOrIteratorOrValue<T>, onImmediate: (value: T, isError: boolean) => void, onDeferred: (value: T, isError: boolean) => void, customResolveValue: TResolveAsyncValue<T>): ResolveResult;
export {};
