// import { log } from '../logging';
export const getNumberOfTeams = (data) => data.teams.length;
/** ESPN does not support dynasty leagues, but we have left isDynastyLeague in case
 * that ever changes. Right now it should always return `false`.
 */
export const isDynastyLeague = () => false;
export const getDraftType = (data) => {
    const { settings } = data;
    const { draftSettings } = settings;
    const { type } = draftSettings;
    if (type === 'SNAKE') {
        return 'SNAKE';
    }
    if (type === 'SNAIL') {
        return 'SNAKE';
    }
    if (type === 'AUTOPICK') {
        return 'LINEAR';
    }
    if (type === 'AUCTION') {
        return 'AUCTION';
    }
    return null;
};
export const getStartingAuctionBudget = (data) => {
    const { settings } = data;
    const { draftSettings } = settings;
    return draftSettings.auctionBudget;
};
export const getRemainingDraftBudget = (teamId, budget, draft) => {
    const { draftDetail } = draft;
    const { picks } = draftDetail;
    // If picks is empty, then we have not started the draft yet.
    // Return the total budget
    if (picks.length === 0) {
        return budget;
    }
    // Iterate through the picks, total the `bidAmount` values for objects that match `teamId`
    const totalBidAmount = picks.reduce((acc, pick) => {
        const { teamId: pickTeamId, bidAmount } = pick;
        if (pickTeamId === teamId) {
            return acc + bidAmount;
        }
        return acc;
    }, 0);
    // Return the remaining budget
    return budget - totalBidAmount;
};
export const getDraftOrder = (data) => {
    const { settings } = data;
    const { draftSettings } = settings;
    const { pickOrder } = draftSettings;
    return pickOrder;
};
/** For now, getPickedPlayers just returns objects with `id` and `fullName` properties,
 * but we may want to add more properties in the future based on how this information is
 * intended to be consumed.
 */
export const getPickedPlayers = (draft, playerData) => {
    const { draftDetail } = draft;
    const { picks } = draftDetail;
    const { players } = playerData;
    return picks.map((pick) => {
        const player = players.find((p) => p.id === pick.playerId);
        if (!player) {
            throw new Error(`getPickedPlayers: could not find player with id ${pick.playerId}`);
        }
        const { id, player: nestedPlayer } = player;
        const { fullName } = nestedPlayer;
        return {
            id,
            fullName,
        };
    });
};
export const getWhichTeamPickedPlayer = (draft, playerId) => {
    const { draftDetail } = draft;
    const { picks } = draftDetail;
    const pick = picks.find((p) => p.playerId === playerId);
    if (!pick) {
        return null;
    }
    return pick.teamId;
};
export const getPlayerPickOrder = (draft, playerId) => {
    const { draftDetail } = draft;
    const { picks } = draftDetail;
    const pick = picks.find((p) => p.playerId === playerId);
    if (!pick) {
        return null;
    }
    return pick.overallPickNumber;
};
export const getFreeAgentsDuringDraft = (draft, playerData) => {
    const { draftDetail } = draft;
    const { picks } = draftDetail;
    const { players } = playerData;
    return players
        .filter((player) => {
        const { id } = player;
        const isPicked = picks.some((p) => p.playerId === id);
        return !isPicked;
    })
        .map((player) => {
        const { id, player: nestedPlayer } = player;
        const { fullName } = nestedPlayer;
        return {
            id,
            fullName,
        };
    });
};
export const getPlayerNflTeam = (playerData, teams) => {
    const { player } = playerData;
    const { proTeamId } = player;
    const { settings } = teams;
    const { proTeams } = settings;
    if (proTeamId === 0) {
        return 'Free Agent';
    }
    const proTeam = proTeams.find((p) => p.id === proTeamId);
    const result = proTeam ? `${proTeam.location} ${proTeam.name}` : 'Unknown';
    return result;
};
export const getAverageDraftPosition = (playerId, playersData) => {
    const { players } = playersData;
    const player = players.find((p) => p.id === playerId);
    if (!player) {
        throw new Error(`getAverageDraftPosition: could not find player with id ${playerId}`);
    }
    const { player: nestedPlayer } = player;
    const { ownership } = nestedPlayer;
    const { averageDraftPosition } = ownership;
    return averageDraftPosition;
};
export const getAverageAuctionPrice = (playerId, playersData) => {
    const { players } = playersData;
    const player = players.find((p) => p.id === playerId);
    if (!player) {
        throw new Error(`getAverageAuctionPrice: could not find player with id ${playerId}`);
    }
    const { player: nestedPlayer } = player;
    const { ownership } = nestedPlayer;
    const { auctionValueAverage } = ownership;
    return auctionValueAverage;
};
export const getTeams = (data, draft, settings) => {
    const { teams } = data;
    return teams.map((team) => {
        const { id } = team;
        const startingBudget = getStartingAuctionBudget(settings);
        const remainingDraftBudget = getRemainingDraftBudget(id, startingBudget, draft);
        return {
            id,
            remainingDraftBudget,
        };
    });
};
export const getRosterLineupSlot = (playerId, teamId, userRoster) => {
    const { teams } = userRoster;
    const playerTeam = teams.find((x) => x.id === teamId);
    // 'User' Team Case
    if (playerTeam !== undefined && 'roster' in playerTeam) {
        const { roster } = playerTeam;
        if (roster !== undefined && 'entries' in roster) {
            const {entries} = roster;
            const player = entries.find((p) => p.playerId === playerId);
            if (!player) {
       
                throw new Error(`getRosterLineupSlot: could not find player with id ${playerId}`);
            }
            if (player.lineupSlotId !== null && player.lineupSlotId.toString() !== '') {
                const rosterPosition = player.lineupSlotId.toString();
                return rosterPosition;
            }
            
            return '';
        }

    }
    // 'Other' Teams Case or Default Case
    return '';
};
// eslint-disable-next-line max-len
const getWalterPlayer = (player, playersData, draft, proTeams) => {
    const auctionValueAverage = getAverageAuctionPrice(player.id, playersData);
    const averageDraftPosition = getAverageDraftPosition(player.id, playersData);
    const pickOrder = getPlayerPickOrder(draft, player.id);
    const proTeam = getPlayerNflTeam(player, proTeams);
    const { id, onTeamId, player: nestedPlayer } = player;
    const { fullName } = nestedPlayer;
    return {
        auctionValueAverage,
        averageDraftPosition,
        espnId: id,
        fullName,
        pickOrder,
        proTeam,
        teamId: onTeamId,
    };
};
// eslint-disable-next-line max-len
export const getWalterPlayers = (playersData, draftData, proTeams) => {
    const { players } = playersData;
    return players.map((player) => getWalterPlayer(player, playersData, draftData, proTeams)).filter((p) => p);
};
export const getLeagueName = (data) => {
    const { settings } = data;
    const { name } = settings;
    return name;
};
export const getTeamName = (data, swid) => {
    const { teams } = data;
    // Find the team in the teams array, whose owners array includes the swid string
    const team = teams.find((t) => t.owners.some((o) => o === swid));
    if (!team) {
        throw new Error(`getTeamName: could not find team with swid ${swid}`);
    }
    const { location, nickname } = team;
    return `${location} ${nickname}`;
};
export const getTeamId = (data, swid) => {
    const { teams } = data;
    // Find the team in the teams array, whose owners array includes the swid string
    const team = teams.find((t) => t.owners.some((o) => o === swid));
    if (!team) {
        throw new Error(`getTeamId: could not find team with swid ${swid}`);
    }
    const { id } = team;
    return id;
};
export const getLeagueSettings = (data) => {
    const { settings } = data;
    const { scoringsettings } = settings;
    const { size } = settings;
    const { rostersettings } = settings;
    const { lineupslotcounts } = rostersettings;
    // Position mapping came from this:
    // https://gitlab.com/walterpicks/2021-2022-fantasy-data/-/blob/main/espn/scripts/lineupSlots.js
    const positionMapping = {
        qb: 0,
        rb: 2,
        wr: 4,
        te: 6,
        flex: 23,
        kickers: 17,
        defense: 16,
        bench: 20,
    };
    const numQBs = lineupslotcounts[positionMapping.qb] ?? 0;
    const numRbs = lineupslotcounts[positionMapping.rb] ?? 0;
    const numWrs = lineupslotcounts[positionMapping.wr] ?? 0;
    const numTes = lineupslotcounts[positionMapping.te] ?? 0;
    const numFlex = lineupslotcounts[positionMapping.flex] ?? 0;
    const numKickers = lineupslotcounts[positionMapping.kickers] ?? 0;
    const numDefense = lineupslotcounts[positionMapping.defense] ?? 0;
    const numBench = lineupslotcounts[positionMapping.bench] ?? 0;
    // We are pretty sure that the scoring value for receptions are in statId 53,
    // which means we can look for that value to determine if a league is PPR or half PPR.
    //
    // We also do not think that ESPN has other options besides PPR/Half PPR, so we will
    // handle any other scenario by defaulting to PPR.
    const { scoringitems } = scoringsettings;
    const receptionscoring = scoringitems.find((x) => x.statId === 53) || { points: 1 };
    const { points } = receptionscoring;
    const scoring = points === 0.5 ? 'half_ppr' : 'ppr';
    return {
        platform: 'espn',
        scoring,
        numTeams: size,
        startingQbs: numQBs,
        startingRbs: numRbs,
        startingWrs: numWrs,
        startingTes: numTes,
        startingFlex: numFlex,
        startingSuperFlex: 0,
        startingKickers: numKickers,
        startingDefense: numDefense,
        bench: numBench,
    };
};
export const getTeamsFromESPNLeagueInformation = (rosters, playerInformation, userRoster) => {
    const playersByTeamId = new Map();
    playerInformation.players.forEach((p) => {
        const teamId = p.onTeamId;
        if (!playersByTeamId.has(teamId)) {
            playersByTeamId.set(teamId, [p]);
        }
        else {
            playersByTeamId.set(teamId, [...playersByTeamId.get(teamId), p]);
        }
    });
    const { teams } = rosters;
    const teamsWithRosters = teams.map((t) => {
        const walterPlayers = playersByTeamId.get(t.id)?.map((p) => ({
            espnId: p.id,
            fullName: p.player.fullName,
            teamId: t.id,
            rosterPosition: getRosterLineupSlot(p.id, t.id, userRoster),
        }));
        // Currently only able to grab starters/ bench from the user's team.
        // We want to exclude the empty string, which belongs to players on other teams, from both these filters.
        // Starters: we want to exclude players with rosterPositions: '20'(Bench), '21'(IR)
        // Bench: we want to ONLY include players with rosterPositions: '20'(Bench), '21'(IR)
        const isStarter = (player) => player.rosterPosition !== '' && player.rosterPosition !== '20' && player.rosterPosition !== '21';
        const isBench = (player) => player.rosterPosition !== '' && (player.rosterPosition === '20' || player.rosterPosition === '21');
        const walterStarters = walterPlayers.filter(isStarter);
        const walterBench = walterPlayers.filter(isBench);
        return {
            teamId: t.id,
            teamName: `${t.location} ${t.nickname}`,
            owners: [...t.owners],
            players: walterPlayers,
            starters: walterStarters,
            bench: walterBench,
        };
    });
    return teamsWithRosters;
};
