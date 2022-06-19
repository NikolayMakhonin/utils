import { IAbortSignalFast } from '@flemist/abort-controller-fast';
import { ITimeController } from '../time-controller/contracts';
export declare function delay(milliseconds: number, abortSignal?: IAbortSignalFast, timeController?: ITimeController): Promise<void>;
