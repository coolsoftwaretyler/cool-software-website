import axios from 'axios';
import { draftFunctions } from './draftHelper';
import { settingsFunctions } from './settingsHelper';
import { knownLeaguesFunctions } from './knownLeaguesHelper';
import { leagueRostersFunctions } from './leagueRostersHelper';
import { getNewConfig } from './yahoo/dataFetching';
import { getYahooUserGUID } from './yahooGUIDHelper';
import { overrideLogger, log } from './logging';
axios.interceptors.request.use((config) => {
    // Log before request is sent
    try {
        const logData = {
            url: config.url ?? null,
            method: config.method ?? null,
            params: config.params ?? null,
            data: config.data ?? null,
        };
        if (log.harvestData && typeof log.harvestData === 'function') {
            log.harvestData('league_sync_axios_request', logData);
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return config;
}, (error) => 
// Do something with request error
Promise.reject(error));
axios.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // log response
    try {
        const logData = {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
        if (log.harvestData && typeof log.harvestData === 'function') {
            log.harvestData('league_sync_axios_response', logData);
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    return response;
}, (error) => 
// Any status codes that falls outside the range of 2xx cause this function to trigger
Promise.reject(error));
/**
 * getKnownLeagues will use a PlatformConfig object to query the specified platform,
 * and return an array of WalterKnownLeague representations of the leagues the user is a member of.
 *
 * Each platform has different ways of accessing this information, so this is a wrapper function
 * around those implementaitons, which are all stored in the knownLeaguesFunctions import.
 *
 * @param platform
 * @param config
 * @returns WalterKnownLeague[]
 */
const getKnownLeagues = async (platform, config) => {
    let result;
    switch (platform) {
        case 'espn':
            result = await knownLeaguesFunctions.espn(config);
            break;
        case 'sleeper':
            result = await knownLeaguesFunctions.sleeper(config);
            break;
        case 'yahoo':
            result = await knownLeaguesFunctions.yahoo(config);
            break;
        default:
            throw new Error(`${platform} is not a valid platform slug.`);
    }
    return result;
};
/**
 * getDraftState returns a WalterDraftState object, based on four pieces of information:
 * 1. First we need to know what platform we're using, it must be a valid platform for the library.
 * 2. Then, we will need a config object for that platform.
 * 3. Then, we need the league id.
 * 4. Next, we need some year to denote the season of the league we want to check.
 *
 * As with getKnownLeagues, this is a wrapper function around the implementations of the draft functions,
 * imported from the helper module.
 *
 * @param platform
 * @param config
 * @param leagueId
 * @param year
 * @returns WalterDraftState
 */
const getDraftState = async (platform, config, leagueId, year) => {
    let result;
    switch (platform) {
        case 'espn':
            result = await draftFunctions.espn(config, leagueId, year);
            break;
        case 'sleeper':
            result = await draftFunctions.sleeper(config, leagueId);
            break;
        case 'yahoo':
            result = await draftFunctions.yahoo(config, leagueId);
            break;
        default:
            throw new Error(`${platform} is not a valid platform slug.`);
    }
    return result;
};
const getLeagueRosters = async (platform, config, leagueId, year) => {
    let result;
    switch (platform) {
        case 'espn':
            result = await leagueRostersFunctions.espn(config, leagueId, year);
            break;
        case 'sleeper':
            result = await leagueRostersFunctions.sleeper(leagueId);
            break;
        case 'yahoo':
            result = await leagueRostersFunctions.yahoo(config, leagueId);
            break;
        default:
            throw new Error(`${platform} is not a valid platform slug.`);
    }
    return result;
};
const getLeagueSettings = async (platform, config, leagueId, year) => {
    let result;
    switch (platform) {
        case 'espn':
            result = await settingsFunctions.espn(config, leagueId, year);
            break;
        case 'sleeper':
            result = await settingsFunctions.sleeper(config, leagueId);
            break;
        case 'yahoo':
            result = await settingsFunctions.yahoo(config, leagueId);
            break;
        default:
            throw new Error(`${platform} is not a valid platform slug.`);
    }
    return result;
};
/**
 * refreshYahooAccessToken exposes a utility function from the Yahoo Data Fetching module,
 * which will refresh the access token for the Yahoo platform.
 *
 * It requires a valid refresh token, and will query our Firebase cloud functions,
 * which have an endpoint set up to take a Yahoo refresh token, and return
 * a new access token and expiration timestamp.
 *
 * @param refreshToken
 * @returns Promise<{newAccessToken: string, newExpirationTimestamp: number}>
 */
// eslint-disable-next-line max-len
const refreshYahooAccessToken = async (refreshToken) => {
    const response = await getNewConfig(refreshToken);
    return response;
};
const getYahooGUID = async (config) => {
    const response = await getYahooUserGUID(config);
    return response;
};
export { getDraftState, getKnownLeagues, getLeagueSettings, getLeagueRosters, getYahooGUID, refreshYahooAccessToken, overrideLogger, };
