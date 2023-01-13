import * as ESPNAdapter from './espn/adapter';
import * as ESPNDataFetching from './espn/dataFetching';
import * as SleeperAdapter from './sleeper/adapter';
import * as SleeperDataFetching from './sleeper/dataFetching';
import * as YahooAdapter from './yahoo/adapter';
import * as YahooDataFetching from './yahoo/dataFetching';
/**
 * getESPNLeagueRosters can take an ESPNConfig object and return an array of WalterLeagueTeamRoster.
 *
 * It requires us to setConfiguration for ESPN, which will give us things like authorization,
 * and allow us to infer the user's ID.
 *
 * @param config
 * @returns
 */
const getESPNLeagueRosters = async (config, leagueId, year) => {
    const { espnS2, espnSWID } = config;
    ESPNDataFetching.setConfiguration(espnS2, espnSWID);
    const rosters = (await ESPNDataFetching.getEspnLeagueInformation({ leagueId, year }));
    const playerInformation = (await ESPNDataFetching.getEspnPlayerInformation({ leagueId, year }));
    const userTeamId = ESPNAdapter.getTeamId(rosters, espnSWID);
    const userRoster = (await ESPNDataFetching.getEspnUserRoster({ leagueId, year, userTeamId }));
    const walterLeagueTeamRosters = ESPNAdapter.getTeamsFromESPNLeagueInformation(rosters, playerInformation, userRoster);
    return walterLeagueTeamRosters;
};
/**
 * getSleeperUserData can take an SleeperConfig object and return an array of WalterLeagueTeamRoster.
 *
 * It uses a helper function called targetSeasons(), which allows us to only look at the current year and past year,
 * in order to get the relevant leagues for a particular user.
 *
 * @param config
 * @returns
 */
const getSleeperLeagueRosters = async (leagueId) => {
    const sleeperTeamsData = await SleeperDataFetching.getTeamsInLeague(leagueId);
    const sleeperRosters = await SleeperDataFetching.getLeagueUsersByLeagueId(leagueId);
    const walterTeamsData = SleeperAdapter.sleeperTeamsToWalterTeams(sleeperTeamsData);
    const walterTeams = walterTeamsData.map((t) => {
        const { owners } = t;
        // If there is an owners array,
        // use the first as the ownerId and get the name of the roster
        if (owners && owners.length > 0 && owners[0]) {
            const ownerId = owners[0];
            const teamName = SleeperAdapter.getRosterNameByUserId(sleeperRosters, ownerId);
            return {
                ...t,
                teamName,
            };
        }
        // If there is not an owner id (team ran by a bot) keep default team name (Team #)
        return t;
    });
    return walterTeams;
};
/**
 * getYahooUserData can take an YahooConfig object and return an array of WalterLeagueTeamRoster,
 * using some Yahoo data endpoints and data adapter functions.
 *
 * @param config
 * @returns
 */
const getYahooLeagueRosters = async (config, leagueId) => {
    const { accessToken } = config;
    const yahooTeamData = await YahooDataFetching.getTeamsInLeague(leagueId, accessToken);
    const walterTeamsData = YahooAdapter.getTeamsInLeague(yahooTeamData.data);
    return walterTeamsData;
};
export const leagueRostersFunctions = {
    espn: getESPNLeagueRosters,
    sleeper: getSleeperLeagueRosters,
    yahoo: getYahooLeagueRosters,
};
