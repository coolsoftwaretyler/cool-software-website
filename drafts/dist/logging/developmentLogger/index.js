/* eslint-disable class-methods-use-this */
/**
 * A note on why we are using react-native-logs package: I wanted to use
 * something like winston or bunyun, but they are intended to work in Node
 * environments and don't work in react-native. Perhaps they could work with
 * some hacking, but it didn't seem worth it after some spike work.
 *
 * react-native-logs does not depend on RN, it is simply compatible with it
 * therefore, using it here makes sense because we intend this library to be
 * included in RN projects
 */
import { logger, consoleTransport } from 'react-native-logs';
const transportOptionsWithColors = {
    colors: {
        info: 'blueBright',
        warn: 'yellowBright',
        error: 'redBright',
    },
    extensionColors: {
        espn: 'magenta',
        home: 'green',
    },
};
const transportOptionsWithoutColors = {};
const defaultSeverity = process.env.NODE_ENV !== 'production' ? 'debug' : 'warn';
const { WP_LEAGUE_SYNC_LOG_SEVERITY } = process.env;
const severity = WP_LEAGUE_SYNC_LOG_SEVERITY !== '' ? WP_LEAGUE_SYNC_LOG_SEVERITY : defaultSeverity;
const configBase = {
    severity,
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    transport: consoleTransport,
    transportOptions: {
        colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
        },
        extensionColors: {
            espn: 'magenta',
            home: 'green',
        },
    },
};
const useColorsForDevelopmentDebugLogging = process.env.WP_LEAGUE_SYNC_DISABLE_LOGGING_COLORS !== 'true';
const developmentDebugConfig = {
    ...configBase,
    transportOptions: useColorsForDevelopmentDebugLogging ? transportOptionsWithColors : transportOptionsWithoutColors,
};
const simpleLog = logger.createLogger(developmentDebugConfig);
class DevelopmentLogger {
    constructor() {
        this.debug = (msg, extraData) => simpleLog.debug(msg, extraData);
        this.info = (msg, extraData) => simpleLog.info(msg, extraData);
        this.warn = (msg, extraData) => simpleLog.warn(msg, extraData);
        this.error = (msg, extraData) => simpleLog.error(msg, extraData);
        this.harvestData = (msg, extraData) => simpleLog.debug(msg, extraData);
    }
}
export const log = new DevelopmentLogger();
