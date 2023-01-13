import * as ESPNAdapter from './espn/adapter';
import * as ESPNDataFetching from './espn/dataFetching';
import * as SleeperAdapter from './sleeper/adapter';
import * as SleeperDataFetching from './sleeper/dataFetching';
import * as YahooAdapter from './yahoo/adapter';
import * as YahooDataFetching from './yahoo/dataFetching';
/**
 * When we sync with Sleeper data, we need to sepcify which seasons we want.
 * Seasons are denoted by the year in which they start, but since fantasy seasons roll across January 1st,
 * we want to make sure we return current seasons even after the year changes.
 *
 * So we return two possible year strings: the current year, and the previous year.
 * Early in the season, we'll fetch user data from last year. But later in the season, it will mean we fetch
 * accurate data from the current year.
 *
 * @returns {String[]}
 */
const targetSeasons = () => {
    // Get the current YYYY
    const currentYear = new Date().getFullYear();
    // Get last year YYYY
    const lastYear = currentYear - 1;
    return [currentYear.toString(), lastYear.toString()];
};
/**
 *
 * getESPNUserData can take an ESPNConfig object and return an array of WalterKnownLeagues.
 *
 * It requires us to setConfiguration for ESPN, which will give us things like authorization,
 * and allow us to infer the user's ID.
 *
 * @param config
 * @returns
 */
const getESPNUserData = async (config) => {
    const { espnS2, espnSWID, leagues } = config;
    ESPNDataFetching.setConfiguration(espnS2, espnSWID);
    if (leagues) {
        const knownLeagues = await Promise.all(leagues.map(async (league) => {
            const { leagueId, year } = league;
            const options = { leagueId, year };
            try {
                const leagueInfo = (await ESPNDataFetching.getEspnLeagueInformation(options));
                return {
                    id: leagueId,
                    leagueName: ESPNAdapter.getLeagueName(leagueInfo),
                    platform: 'espn',
                    teamName: ESPNAdapter.getTeamName(leagueInfo, espnSWID),
                    year,
                };
            }
            catch (e) {
                return {
                    id: 'Not found',
                    leagueName: 'Not found',
                    platform: 'espn',
                    teamName: 'Not found',
                    year: 'Not found',
                };
            }
        }));
        return knownLeagues.filter((league) => league.id !== 'Not found');
    }
    return [];
};
/**
 * getSleeperUserData can take an SleeperConfig object and return an array of WalterKnownLeagues.
 *
 * It uses a helper function called targetSeasons(), which allows us to only look at the current year and past year,
 * in order to get the relevant leagues for a particular user.
 *
 * @param config
 * @returns
 */
const getSleeperUserData = async (config) => {
    const { userId } = config;
    const seasons = targetSeasons();
    const leaguesForThisYear = await SleeperDataFetching.getLeagueDataByUserId(userId, seasons[0]);
    const leaguesForLastyear = await SleeperDataFetching.getLeagueDataByUserId(userId, seasons[1]);
    const leagues = [...leaguesForThisYear, ...leaguesForLastyear];
    const leagueData = [];
    // Loop through every league and get its rosters
    // Then getRosterNameByUserId of each one
    // Push the league name and roster name into leagueData
    // eslint-disable-next-line no-restricted-syntax
    for (const league of leagues) {
        // eslint-disable-next-line no-await-in-loop
        const rosters = await SleeperDataFetching.getLeagueUsersByLeagueId(league.league_id);
        const rosterName = SleeperAdapter.getRosterNameByUserId(rosters, userId);
        const data = {
            id: league.league_id,
            leagueName: league.name,
            platform: 'sleeper',
            teamName: rosterName,
            year: league.season,
        };
        leagueData.push(data);
    }
    return leagueData;
};
/**
 * getYahooUserData can take an YahooConfig object and return an array of WalterKnownLeagues,
 * using some Yahoo data endpoints and data adapter functions.
 *
 * @param config
 * @returns
 */
const getYahooUserData = async (config) => {
    const { accessToken } = config;
    // Then, we want to use getUserData with the token
    const userDataXMLString = await YahooDataFetching.getUserData(accessToken);
    const userGUID = YahooAdapter.getUserGUID(userDataXMLString.data);
    // Then, we get the NFL leagues for a user with the token
    const userLeaguesXMLString = await YahooDataFetching.getUserNFLLeagues(accessToken);
    const userLeagues = YahooAdapter.getUserLeagues(userLeaguesXMLString.data);
    // Then, for each league, we want to get the user's team in that league
    const userLeaguesAndTeams = userLeagues.map(async (league) => {
        const { leagueKey, name: leagueName, season } = league;
        const leagueTeamsResponse = await YahooDataFetching.getLeagueTeams(leagueKey, accessToken);
        const team = YahooAdapter.getTeamInfo(userGUID, leagueTeamsResponse.data);
        const { name: teamName } = team;
        return {
            id: leagueKey,
            leagueName,
            platform: 'yahoo',
            teamName,
            year: season,
        };
    });
    const result = await Promise.all(userLeaguesAndTeams);
    return result;
};
export const knownLeaguesFunctions = {
    espn: getESPNUserData,
    sleeper: getSleeperUserData,
    yahoo: getYahooUserData,
};
