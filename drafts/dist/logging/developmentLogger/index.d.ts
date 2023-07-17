import { Context } from "@logtail/types";
import { WalterPicksLeagueSyncLogger } from "../interface";

declare class DevelopmentLogger implements WalterPicksLeagueSyncLogger {
  debug: (msg: string, extraData?: Context | undefined) => void;
  info: (msg: string, extraData?: Context | undefined) => void;
  warn: (msg: string, extraData?: Context | undefined) => void;
  error: (msg: string, extraData?: Context | undefined) => void;
  harvestData: (msg: string, extraData?: Context | undefined) => void;
}
export declare const log: DevelopmentLogger;
export {};
