/* eslint-disable no-console */
import { log } from '.';
describe('Default log', () => {
    const infoSpy = jest.spyOn(log, 'info');
    const debugSpy = jest.spyOn(log, 'debug');
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
});
