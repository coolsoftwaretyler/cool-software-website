import { log as devLogger } from './developmentLogger';
const defaultLogger = devLogger;
// eslint-disable-next-line import/no-mutable-exports
export let log = defaultLogger;
export const overrideLogger = (newLogger) => {
    log = newLogger;
};
