// Disable the ESLint rule for this file since we have some User Defined Type Guards,
// which require using `hasOwnProperty` to prevent false negatives.
/* eslint-disable no-prototype-builtins */
import { log } from '../logging';
// We explicitly use the `any` type in these functions,
// since the responses won't be typed, and we're using
// these functions as User Defined Type Guards
/**
 * Reusable helper to handle the pattern of:
 *  - check if this object has a certain property
 *  - if not, log debug info about the object and the missing property and return false
 *  - if it does, then return true and do nothing else
 * @param objectToCheck the object we want to inspect to see if it has a given property
 * @param field the given property we are looking for
 * @param objectNameForLogs a name to describe the object in the logs (for developers to understand)
 * @param callerNameForLogs a name to describe the function calling this function in the logs.
 * Typically just the name of the function you're calling this from
 * @returns true if the object has the field, false otherwise
 */
const checkObjectHasField = (objectToCheck, field, objectNameForLogs, callerNameForLogs) => {
    if (!objectToCheck[field]) {
        log.warn(`${callerNameForLogs} | checkObjectHasField | object '${objectNameForLogs}'  is missing field '${field}'`, { objectToCheck, missingField: field });
        return false;
    }
    return true;
};
const isEspnLeagueObject = (league) => {
    // log.debug('isEspnLeagueObject | league = ', league)
    if (!league.hasOwnProperty('teams')) {
        log.warn('isEspnLeagueObject | league missing teams');
        return false;
    }
    if (!Array.isArray(league.teams)) {
        return false;
    }
    let missingProperty = false;
    league.teams.forEach((team) => {
        if (!checkObjectHasField(team, 'id', 'team', 'isEspnLeagueObject')) {
            missingProperty = true;
            return;
        }
        if (!checkObjectHasField(team, 'location', 'team', 'isEspnLeagueObject')) {
            missingProperty = true;
            return;
        }
        if (!checkObjectHasField(team, 'nickname', 'team', 'isEspnLeagueObject')) {
            missingProperty = true;
        }
    });
    return !missingProperty;
};
const isEspnSettingsObject = (league) => {
    if (!checkObjectHasField(league, 'settings', 'league', 'isEspnSettingsObject')) {
        return false;
    }
    if (!checkObjectHasField(league.settings, 'scoringSettings', 'league.settings', 'isEspnSettingsObject')) {
        return false;
    }
    if (!checkObjectHasField(league.settings.scoringSettings, 'scoringItems', 'league.settings.scoringSettings', 'isEspnSettingsObject')) {
        return false;
    }
    if (!Array.isArray(league.settings.scoringSettings.scoringItems)) {
        return false;
    }
    let missingScoringItemProperty = false;
    league.settings.scoringSettings.scoringItems.forEach((scoringItem) => {
        if (!scoringItem.statId) {
            missingScoringItemProperty = true;
        }
    });
    if (missingScoringItemProperty) {
        return false;
    }
    if (!league.settings.rosterSettings) {
        return false;
    }
    if (!league.settings.rosterSettings.lineupSlotCounts) {
        return false;
    }
    if (!league.settings.rosterSettings.positionLimits) {
        return false;
    }
    if (!league.settings.draftSettings) {
        return false;
    }
    if (!league.settings.draftSettings.type) {
        return false;
    }
    if (!league.settings.draftSettings.auctionBudget) {
        return false;
    }
    if (!league.settings.draftSettings.pickOrder) {
        return false;
    }
    return true;
};
const isDraftDetailObject = (draftDetail) => {
    if (!draftDetail.hasOwnProperty('draftDetail')) {
        return false;
    }
    if (!draftDetail.draftDetail.hasOwnProperty('picks')) {
        return false;
    }
    if (!Array.isArray(draftDetail.draftDetail.picks)) {
        return false;
    }
    let missingPickProperties = false;
    draftDetail.draftDetail.picks.forEach((pick) => {
        if (!pick.hasOwnProperty('teamId')) {
            missingPickProperties = true;
            return;
        }
        if (!pick.hasOwnProperty('bidAmount')) {
            missingPickProperties = true;
            return;
        }
        if (!pick.hasOwnProperty('playerId')) {
            missingPickProperties = true;
        }
    });
    if (missingPickProperties) {
        return false;
    }
    return true;
};
const isEspnPlayersObject = (players) => {
    if (!players.players) {
        return false;
    }
    if (!Array.isArray(players.players)) {
        return false;
    }
    let missingPlayerProperty = false;
    players.players.forEach((player) => {
        if (!player.hasOwnProperty('status')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.hasOwnProperty('player')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.hasOwnProperty('defaultPositionId')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.hasOwnProperty('fullName')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.hasOwnProperty('id')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.hasOwnProperty('proTeamId')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.hasOwnProperty('ownership')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.ownership.hasOwnProperty('averageDraftPosition')) {
            missingPlayerProperty = true;
            return;
        }
        if (!player.player.ownership.hasOwnProperty('auctionValueAverage')) {
            missingPlayerProperty = true;
        }
    });
    if (missingPlayerProperty) {
        return false;
    }
    return true;
};
const isEspnProTeamsObject = (proTeams) => {
    if (!proTeams.hasOwnProperty('settings')) {
        return false;
    }
    if (!proTeams.settings.hasOwnProperty('proTeams')) {
        return false;
    }
    if (!Array.isArray(proTeams.settings.proTeams)) {
        return false;
    }
    let missingProTeamProperties = false;
    proTeams.settings.proTeams.forEach((proTeam) => {
        if (!proTeam.hasOwnProperty('id')) {
            missingProTeamProperties = true;
            return;
        }
        if (!proTeam.hasOwnProperty('name')) {
            missingProTeamProperties = true;
            return;
        }
        if (!proTeam.hasOwnProperty('abbrev')) {
            missingProTeamProperties = true;
        }
    });
    if (missingProTeamProperties) {
        return false;
    }
    return true;
};
export { isEspnLeagueObject, isEspnSettingsObject, isDraftDetailObject, isEspnPlayersObject, isEspnProTeamsObject };
