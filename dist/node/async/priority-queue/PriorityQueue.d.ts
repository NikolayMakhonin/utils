import { PromiseOrValue } from './contracts';
import { PairingNode } from 'src/sync/pairing-heap';
import { IObjectPool } from 'src/sync/object-pool/contracts';
import { Priority } from 'src/sync/priority';
import { IAbortSignalFast } from '@flemist/abort-controller-fast';
declare type TQueueItem<T> = {
    func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>;
    abortSignal: IAbortSignalFast;
    priority: Priority;
    resolve: (value: T) => void;
    reject: (error: Error) => void;
};
export declare function queueItemLessThan(o1: TQueueItem<any>, o2: TQueueItem<any>): boolean;
export declare class PriorityQueue {
    private readonly _queue;
    constructor({ objectPool, }?: {
        objectPool?: IObjectPool<PairingNode<TQueueItem<any>>>;
    });
    run<T>(func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>, priority?: Priority, abortSignal?: IAbortSignalFast): Promise<T>;
    _processRunning: boolean;
    _process(): Promise<void>;
}
export {};
