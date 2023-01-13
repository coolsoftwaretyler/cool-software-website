/* eslint-disable no-console */
import { log, overrideLogger } from '.';
const newlogger = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info: (msg) => {
        // intentional no-op, because we want to assert console.log wasn't called when we override
    },
};
describe('Top level logger', () => {
    const infoSpy = jest.spyOn(log, 'info');
    const debugSpy = jest.spyOn(log, 'debug');
    const newLoggerInfoSpy = jest.spyOn(newlogger, 'info');
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('is defined', () => {
        expect(log).toBeDefined();
    });
    it('can log info and debug logs', () => {
        log.info('hello logger!');
        expect(infoSpy).toBeCalledTimes(1);
        log.info('hello again!');
        log.debug('hello debug!');
        expect(infoSpy).toBeCalledTimes(2);
        expect(debugSpy).toBeCalledTimes(1);
    });
    it('can be overriden', () => {
        overrideLogger(newlogger);
        log.info('hello logger!');
        expect(newLoggerInfoSpy).toBeCalledTimes(1);
        expect(infoSpy).toBeCalledTimes(0);
        expect(debugSpy).toBeCalledTimes(0);
    });
});
