import { IAbortSignalFast } from '@flemist/abort-controller-fast';
import { Priority } from 'src/sync/priority';
export declare type PromiseOrValue<T> = T | Promise<T>;
export interface ITimeLimit {
    tick(abortSignal?: IAbortSignalFast): Promise<void>;
    available(): boolean;
    run<T>(func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>, priority?: Priority, abortSignal?: IAbortSignalFast): Promise<T>;
}
