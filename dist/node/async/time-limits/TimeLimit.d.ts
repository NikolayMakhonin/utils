import { ITimeLimit, PromiseOrValue } from './contracts';
import { PriorityQueue } from 'src/async/priority-queue';
import { Priority } from 'src/sync/priority';
import { IAbortSignalFast } from '@flemist/abort-controller-fast';
export declare class TimeLimit implements ITimeLimit {
    private readonly _maxCount;
    private readonly _timeMs;
    private readonly _priorityQueue;
    constructor({ maxCount, timeMs, priorityQueue, }: {
        maxCount: number;
        timeMs: number;
        priorityQueue?: PriorityQueue;
    });
    private _activeCount;
    private _tickPromise;
    private readonly _releaseFunc;
    private _release;
    private readonly _tickFunc;
    tick(abortSignal?: IAbortSignalFast): Promise<void>;
    available(): boolean;
    run<T>(func: (abortSignal?: IAbortSignalFast) => PromiseOrValue<T>, priority?: Priority, abortSignal?: IAbortSignalFast): Promise<T>;
}
