/* eslint-disable camelcase */
import * as ESPNDataFetching from './espn/dataFetching';
import * as ESPNAdapter from './espn/adapter';
import * as SleeperDataFetching from './sleeper/dataFetching';
import * as SleeperAdapter from './sleeper/adapter';
import * as YahooAdapter from './yahoo/adapter';
import * as YahooDataFetching from './yahoo/dataFetching';
/**
 * getEspnData hits the major endpoints for ESPN's undocumented API,
 * and returns the data in a single object.
 *
 * Since ESPN's API is both undocumented, and not really well structured for our purposes,
 * we'll have to parse this out later in the actual getESPNDraftState function, which expects all this data,
 * and then will manipulate it into a more useful state.
 *
 * Before you call this function, you should set the ESPNDataFetching.setConfiguration function appropriately.
 * Eventually, we hope to refactor that out so we're not reliant on internal state for our network requests,
 * but for now, things are working, and you should get some descriptive error messages if you miss a step.
 *
 * @param leagueId
 * @param year
 * @returns {Promise<{Object}>}
 */
const getEspnData = async (leagueId, year) => {
    const options = { leagueId, year };
    const leagueInfo = (await ESPNDataFetching.getEspnLeagueInformation(options));
    const leagueSettings = (await ESPNDataFetching.getEspnSettings(options));
    const draftDetail = (await ESPNDataFetching.getEspnDraftDetail(options));
    const playerInformation = (await ESPNDataFetching.getEspnPlayerInformation(options));
    const proTeamsInformation = (await ESPNDataFetching.getEspnProTeamsInformation(year));
    return {
        leagueInfo,
        leagueSettings,
        draftDetail,
        playerInformation,
        proTeamsInformation,
    };
};
/**
 * getESPNDraftState takes a given ESPN config, a leagueId, and a year for a particular league,
 * and then returns the WalterDraftState representation of its draft.
 *
 * It relies on the getEspnData function to get most of the requisite information,
 * and then uses the ESPN data adapter module to parse out relevant bits.
 *
 * @param config
 * @param leagueId
 * @param year
 * @returns
 */
const getESPNDraftState = async (config, leagueId, year) => {
    const { espnS2, espnSWID } = config;
    ESPNDataFetching.setConfiguration(espnS2, espnSWID);
    const espnData = await getEspnData(leagueId, year);
    const { leagueInfo, draftDetail, playerInformation, proTeamsInformation } = espnData;
    const myTeamId = ESPNAdapter.getTeamId(leagueInfo, espnSWID);
    const players = ESPNAdapter.getWalterPlayers(playerInformation, draftDetail, proTeamsInformation);
    const pickedPlayersDuringDraft = players.filter((player) => player.pickOrder !== null);
    const myPicks = pickedPlayersDuringDraft.filter((player) => player.teamId === myTeamId);
    const takenPlayers = pickedPlayersDuringDraft.filter((player) => player.teamId !== myTeamId);
    return {
        myPicks,
        takenPlayers,
    };
};
/**
 * getSleeperDraftState is responsible for taking a Sleeper configuration, and a target league ID, and returning the
 * WalterDraftState representation of that league's draft, from the perspective of a particular user.
 *
 * @param config
 * @param leagueId
 * @returns
 */
const getSleeperDraftState = async (config, leagueId) => {
    // First, let's get the drafts for a specific league
    const draftsForLeague = await SleeperDataFetching.getAllDraftsForLeague(leagueId);
    // The endpoint is ordered with the most recent league first.
    // So the most recent draft should be at position [0].
    const mostRecentDraft = draftsForLeague[0];
    // Then we need to get the picks for a specific draft.
    const { draft_id } = mostRecentDraft;
    const picksForDraft = await SleeperDataFetching.getPicksForDraft(draft_id);
    // Finally, we'll want to filter for myPicks, takenPlayers.
    const { userId } = config;
    const myPicks = picksForDraft.filter((pick) => pick.picked_by === userId);
    const takenPlayers = picksForDraft.filter((pick) => pick.picked_by !== userId);
    // Convert both myPicks and takenPlayers to WalterPlayers
    const myPicksWalterPlayers = myPicks.map((pick) => SleeperAdapter.sleeperPickToWalterPlayer(pick));
    const takenPlayersWalterPlayers = takenPlayers.map((pick) => SleeperAdapter.sleeperPickToWalterPlayer(pick));
    return {
        myPicks: myPicksWalterPlayers,
        takenPlayers: takenPlayersWalterPlayers,
    };
};
/**
 * getYahooDraftState is responsible for taking a Yahoo configuration, and a target league ID, and returning the
 * WalterDraftState representation of that league's draft, from the perspective of a particular user.
 *
 * @param config
 * @param leagueId
 * @returns
 */
const getYahooDraftState = async (config, leagueId) => {
    const { accessToken } = config;
    // First, we want to use getUserData with the token
    const userDataXMLString = await YahooDataFetching.getUserData(accessToken);
    const userGUID = YahooAdapter.getUserGUID(userDataXMLString.data);
    // Then, we want to get the team data for this user
    const leagueTeamsResponse = await YahooDataFetching.getLeagueTeams(leagueId, accessToken);
    const { teamKey } = YahooAdapter.getTeamInfo(userGUID, leagueTeamsResponse.data);
    // Then, we want to get the draft for the league
    const leagueDraft = await YahooDataFetching.getLeagueDraft(leagueId, accessToken);
    // Finally, we want to get the draft picks for the league
    const draftState = YahooAdapter.getDraftPicks(teamKey, leagueDraft.data);
    return draftState;
};
export const draftFunctions = {
    espn: getESPNDraftState,
    sleeper: getSleeperDraftState,
    yahoo: getYahooDraftState,
};
