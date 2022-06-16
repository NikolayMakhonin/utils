import { IAbortSignalFast } from '@flemist/abort-controller-fast';
export declare function promiseToAbortable<T>(promise: Promise<T>, abortSignal?: IAbortSignalFast): Promise<T>;
