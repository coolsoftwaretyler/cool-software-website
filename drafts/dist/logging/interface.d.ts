import { Context } from '@logtail/types';
declare type LogFunction = (msg: string, extraData?: Context) => void;
export interface WalterPicksLeagueSyncLogger {
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    harvestData: LogFunction;
}
export {};
