// Yahoo XML will have lots of snake_case, so disable eslint for that.
/* eslint-disable camelcase */
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();
export const getUserGUID = (data) => {
    const object = parser.parse(data);
    const { fantasy_content } = object;
    const { users } = fantasy_content;
    const { user } = users;
    const { guid } = user;
    return guid;
};
export const getUserLeagues = (data) => {
    const object = parser.parse(data);
    const { fantasy_content } = object;
    const { users } = fantasy_content;
    const { user } = users;
    const { games } = user;
    const gamesArray = Object.keys(games).map((key) => games[key]);
    const nfl = gamesArray.filter((game) => game.code === 'nfl')[0];
    const { leagues } = nfl;
    // If there are no leagues, then leagues will be an empty string,
    // and we should return an empty array.
    if (leagues === '') {
        return [];
    }
    // If there is only one league, we'll just be handed a single object,
    // but if there are multiple leagues, we'll be handed an array.
    // So here we check if the API gave an array. If so, we just keep going.
    // If not, we wrap the response in an array
    const { league } = leagues;
    const leaguesArray = Array.isArray(league) ? league : [league];
    return leaguesArray.map((l) => {
        const { league_key, name, season } = l;
        return {
            leagueKey: league_key,
            name,
            season,
        };
    });
};
export const getTeamInfo = (userId, data) => {
    const object = parser.parse(data);
    const { fantasy_content } = object;
    const { league } = fantasy_content;
    const { teams } = league;
    const { team } = teams;
    // If there is only one team, we'll just be handed a single object,
    // but if there are multiple teams, we'll be handed an array.
    // So here we check if the API gave an array. If so, we just keep going.
    // If not, we wrap the response in an array
    const teamsArray = Array.isArray(team) ? team : [team];
    const userTeam = teamsArray.filter((t) => {
        const { managers } = t;
        const managersArray = Object.keys(managers).map((key) => managers[key]);
        return managersArray.some((manager) => {
            // In instances where there are only one manager,
            // we just get a top-level object in the array, and we can compare `.guid === userId`
            if (manager.guid === userId) {
                return true;
            }
            // But when there are multiple managers, the object is actually a nested array, so we want to check
            // inside that array.
            if (Array.isArray(manager)) {
                return manager.some((m) => m.guid === userId);
            }
            return false;
        });
    });
    if (userTeam[0]) {
        const { team_logos, name, team_key } = userTeam[0];
        const teamLogosArray = Object.keys(team_logos).map((key) => team_logos[key]);
        const team_logo = teamLogosArray[0];
        const { url } = team_logo;
        return {
            name,
            logo: url,
            teamKey: team_key,
        };
    }
    return {
        name: 'Not found',
        logo: 'Not found',
        teamKey: 'Not found',
    };
};
export const getDraftPicks = (teamKey, data) => {
    const obj = parser.parse(data);
    const { fantasy_content } = obj;
    const { league } = fantasy_content;
    const { draft_results } = league;
    const { draft_result } = draft_results;
    const myPicks = draft_result.filter((pick) => pick.team_key === teamKey);
    const takenPlayers = draft_result.filter((pick) => pick.team_key !== teamKey);
    return {
        myPicks,
        takenPlayers,
    };
};
export const getLeagueSettings = (data) => {
    const object = parser.parse(data);
    const { fantasy_content } = object;
    const { league } = fantasy_content;
    const { settings } = league;
    const { stat_modifiers, roster_positions } = settings;
    const { stats } = stat_modifiers;
    const { stat } = stats;
    const scoringForReceptions = stat.find((s) => s.stat_id === 11);
    const recValueToScoringType = {
        1: 'ppr',
        0.5: 'half_ppr',
        0: 'standard',
    };
    const scoring = recValueToScoringType[scoringForReceptions.value];
    const { roster_position } = roster_positions;
    const qbPositionData = roster_position.find((p) => p.position === 'QB');
    const rbPositionData = roster_position.find((p) => p.position === 'RB');
    const wrPositionData = roster_position.find((p) => p.position === 'WR');
    const tePositionData = roster_position.find((p) => p.position === 'TE');
    const flexPositionData = roster_position.find((p) => p.position === 'W/R/T');
    const superFlexPositionData = roster_position.find((p) => p.position === 'Q/W/R/T');
    const kickerPositionData = roster_position.find((p) => p.position === 'K');
    const dstPositionData = roster_position.find((p) => p.position === 'DEF');
    const benchPositionData = roster_position.find((p) => p.position === 'BN');
    const { num_teams } = league;
    const numQbs = qbPositionData && qbPositionData.count ? qbPositionData.count : 0;
    const numRbs = rbPositionData && rbPositionData.count ? rbPositionData.count : 0;
    const numWrs = wrPositionData && wrPositionData.count ? wrPositionData.count : 0;
    const numTes = tePositionData && tePositionData.count ? tePositionData.count : 0;
    const numFlex = flexPositionData && flexPositionData.count ? flexPositionData.count : 0;
    const numSflex = superFlexPositionData && superFlexPositionData.count ? superFlexPositionData.count : 0;
    const numKickers = kickerPositionData && kickerPositionData.count ? kickerPositionData.count : 0;
    const numDst = dstPositionData && dstPositionData.count ? dstPositionData.count : 0;
    const numBench = benchPositionData && benchPositionData.count ? benchPositionData.count : 0;
    const scoringValue = scoring ?? 'ppr';
    return {
        platform: 'yahoo',
        scoring: scoringValue,
        numTeams: num_teams,
        startingQbs: numQbs,
        startingRbs: numRbs,
        startingWrs: numWrs,
        startingTes: numTes,
        startingFlex: numFlex,
        startingSuperFlex: numSflex,
        startingKickers: numKickers,
        startingDefense: numDst,
        bench: numBench,
    };
};
const getPlayersFromRoster = (players, teamId) => {
    const walterPlayers = players.map((p) => {
        /* eslint-disable no-shadow */
        const { player_id, name, selected_position } = p;
        const { full } = name;
        const { position } = selected_position;
        return {
            fullName: full,
            yahooId: player_id,
            teamId,
            rosterPosition: position,
        };
    });
    return walterPlayers;
};
export const getTeamsInLeague = (data) => {
    const object = parser.parse(data);
    const { fantasy_content } = object;
    const { league } = fantasy_content;
    const { teams } = league;
    const { team } = teams;
    const walterTeams = team.map((t) => {
        const { team_id, name, roster, managers } = t;
        const { players } = roster;
        const { player } = players;
        const walterPlayers = getPlayersFromRoster(player, team_id);
        const walterStarters = walterPlayers.filter((teamPlayer) => !teamPlayer.rosterPosition?.includes('BN') && !teamPlayer.rosterPosition?.includes('IR'));
        const walterBench = walterPlayers.filter((teamPlayer) => teamPlayer.rosterPosition?.includes('BN') || teamPlayer.rosterPosition?.includes('IR'));
        let owners;
        if (Array.isArray(managers.manager)) {
            owners = managers.manager.map((m) => m.guid);
        }
        else {
            owners = [managers.manager.guid];
        }
        const walterTeam = {
            teamId: team_id,
            teamName: name,
            owners,
            players: walterPlayers,
            starters: walterStarters,
            bench: walterBench,
        };
        return walterTeam;
    });
    return walterTeams;
};
