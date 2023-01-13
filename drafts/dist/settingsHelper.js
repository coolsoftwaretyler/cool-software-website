/* eslint-disable camelcase */
import * as ESPNDataFetching from './espn/dataFetching';
import * as ESPNAdapter from './espn/adapter';
import * as SleeperDataFetching from './sleeper/dataFetching';
import * as SleeperAdapter from './sleeper/adapter';
import * as YahooAdapter from './yahoo/adapter';
import * as YahooDataFetching from './yahoo/dataFetching';
const getEspnSettings = async (config, leagueId, year) => {
    const { espnS2, espnSWID } = config;
    ESPNDataFetching.setConfiguration(espnS2, espnSWID);
    const options = { leagueId, year };
    const leagueSettings = (await ESPNDataFetching.getEspnSettings(options));
    const walterLeagueSettings = ESPNAdapter.getLeagueSettings(leagueSettings);
    return walterLeagueSettings;
};
const getSleeperSettings = async (config, leagueId) => {
    const sleeperLeague = await SleeperDataFetching.getLeague(leagueId);
    const walterLeagueSettings = SleeperAdapter.getLeagueSettings(sleeperLeague);
    return walterLeagueSettings;
};
const getYahooSettings = async (config, leagueId) => {
    const { accessToken } = config;
    const leagueDataAsXML = await YahooDataFetching.getLeagueSettings(leagueId, accessToken);
    const walterLeagueSettings = YahooAdapter.getLeagueSettings(leagueDataAsXML.data);
    return walterLeagueSettings;
};
export const settingsFunctions = {
    espn: getEspnSettings,
    sleeper: getSleeperSettings,
    yahoo: getYahooSettings,
};
