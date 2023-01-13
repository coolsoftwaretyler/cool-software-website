import { overrideLogger } from './logging';
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
declare const getKnownLeagues: (platform: PlatformSlug, config: PlatformConfig) => Promise<WalterKnownLeague[]>;
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
declare const getDraftState: (platform: PlatformSlug, config: PlatformConfig, leagueId: string, year: string) => Promise<WalterDraftState>;
declare const getLeagueRosters: (platform: PlatformSlug, config: PlatformConfig, leagueId: string, year: string) => Promise<WalterLeagueTeamRoster[]>;
declare const getLeagueSettings: (platform: PlatformSlug, config: PlatformConfig, leagueId: string, year: string) => Promise<WalterLeagueSettings>;
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
declare const refreshYahooAccessToken: (refreshToken: string) => Promise<{
    newAccessToken: string;
    newExpirationTimestamp: number;
}>;
declare const getYahooGUID: (config: YahooConfig) => Promise<string>;
export { getDraftState, getKnownLeagues, getLeagueSettings, getLeagueRosters, getYahooGUID, refreshYahooAccessToken, overrideLogger, };
