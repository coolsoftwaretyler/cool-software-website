// Disable the ESLint rule for this file since we have some User Defined Type Guards,
// which require using `hasOwnProperty` to prevent false negatives.
/* eslint-disable no-prototype-builtins */
// We explicitly use the `any` type in these functions,
// since the responses won't be typed, and we're using
// these functions as User Defined Type Guards
const isYahooLeagueObject = (league) => {
    if (!league.fantasy_content) {
        return false;
    }
    if (!league.fantasy_content.league) {
        return false;
    }
    if (!league.fantasy_content.league.league_key) {
        return false;
    }
    if (!league.fantasy_content.league.name) {
        return false;
    }
    if (!league.fantasy_content.league.teams) {
        return false;
    }
    if (!Array.isArray(league.fantasy_content.league.teams.team)) {
        return false;
    }
    let missingProperty = false;
    league.fantasy_content.league.teams.team.forEach((team) => {
        if (!team.team_id) {
            missingProperty = true;
            return;
        }
        if (!team.name) {
            missingProperty = true;
        }
    });
    return !missingProperty;
};
const isYahooSettingsObject = (league) => {
    if (!league.fantasy_content) {
        return false;
    }
    if (!league.fantasy_content.league) {
        return false;
    }
    if (!league.fantasy_content.league.scoring_type) {
        return false;
    }
    if (!league.fantasy_content.league.settings) {
        return false;
    }
    if (!league.fantasy_content.league.settings.roster_positions) {
        return false;
    }
    if (!league.fantasy_content.league.settings.roster_positions.roster_position) {
        return false;
    }
    if (!Array.isArray(league.fantasy_content.league.settings.roster_positions.roster_position)) {
        return false;
    }
    let missingRosterPositionProperty = false;
    league.fantasy_content.league.settings.roster_positions.roster_position.forEach((rosterItem) => {
        if (!rosterItem.position) {
            missingRosterPositionProperty = true;
        }
        if (!rosterItem.count) {
            missingRosterPositionProperty = true;
        }
        if (!rosterItem.is_starting_position) {
            missingRosterPositionProperty = true;
        }
    });
    if (missingRosterPositionProperty) {
        return false;
    }
    if (!league.fantasy_content.league.settings.stat_categories) {
        return false;
    }
    if (!Array.isArray(league.fantasy_content.league.settings.stat_categories.stats.stat)) {
        return false;
    }
    let missingStatCategoryProperty = false;
    league.fantasy_content.league.settings.stat_categories.stats.stat.forEach((statItem) => {
        if (!statItem.stat_id) {
            missingStatCategoryProperty = true;
        }
        if (!statItem.name) {
            missingStatCategoryProperty = true;
        }
    });
    if (missingStatCategoryProperty) {
        return false;
    }
    if (!league.fantasy_content.league.settings.stat_modifiers) {
        return false;
    }
    if (!Array.isArray(league.fantasy_content.league.settings.stat_modifiers.stats.stat)) {
        return false;
    }
    let missingStatModifierProperty = false;
    league.fantasy_content.league.settings.stat_modifiers.stats.stat.forEach((statItem) => {
        if (!statItem.stat_id) {
            missingStatModifierProperty = true;
        }
        if (!statItem.value) {
            missingStatModifierProperty = true;
        }
    });
    if (missingStatModifierProperty) {
        return false;
    }
    return true;
};
const isYahooDraftDetailObject = (draftDetail) => {
    if (!draftDetail.fantasy_content) {
        return false;
    }
    if (!draftDetail.fantasy_content.league) {
        return false;
    }
    if (!draftDetail.fantasy_content.league.draft_results) {
        return false;
    }
    if (!draftDetail.fantasy_content.league.draft_results.draft_result) {
        return false;
    }
    if (!draftDetail.fantasy_content.league.draft_results.count) {
        return false;
    }
    if (!Array.isArray(draftDetail.fantasy_content.league.draft_results.draft_result)) {
        return false;
    }
    let missingDraftProperty = false;
    draftDetail.fantasy_content.league.draft_results.draft_result.forEach((draftItem) => {
        if (!draftItem.pick) {
            missingDraftProperty = true;
        }
        if (!draftItem.round) {
            missingDraftProperty = true;
        }
    });
    if (missingDraftProperty) {
        return false;
    }
    return true;
};
const isYahooPlayersObject = (players) => {
    if (!players.fantasy_content) {
        return false;
    }
    if (!players.fantasy_content.league) {
        return false;
    }
    if (!players.fantasy_content.league.players) {
        return false;
    }
    if (!Array.isArray(players.fantasy_content.league.players.player)) {
        return false;
    }
    let missingProperty = false;
    players.fantasy_content.league.players.player.forEach((player) => {
        if (!player.name) {
            missingProperty = true;
        }
        if (!player.player_id) {
            missingProperty = true;
        }
        if (!player.primary_position) {
            missingProperty = true;
        }
        if (!player.editorial_team_full_name) {
            missingProperty = true;
        }
    });
    if (missingProperty) {
        return false;
    }
    return true;
};
const isYahooLeaguesObject = (leagues) => {
    if (!leagues.fantasy_content) {
        return false;
    }
    if (!leagues.fantasy_content.users) {
        return false;
    }
    if (!leagues.fantasy_content.users.user) {
        return false;
    }
    if (!leagues.fantasy_content.users.user.games) {
        return false;
    }
    if (!leagues.fantasy_content.users.user.games.game) {
        return false;
    }
    if (!leagues.fantasy_content.users.user.games.game.leagues) {
        return false;
    }
    if (!leagues.fantasy_content.users.user.games.game.leagues.league) {
        return false;
    }
    let missingLeagueProperty = false;
    leagues.fantasy_content.users.user.games.game.leagues.league.forEach((league) => {
        if (!league.league_id) {
            missingLeagueProperty = true;
        }
        if (!league.name) {
            missingLeagueProperty = true;
        }
        if (!league.season) {
            missingLeagueProperty = true;
        }
    });
    if (missingLeagueProperty) {
        return false;
    }
    return true;
};
export { isYahooLeagueObject, isYahooLeaguesObject, isYahooSettingsObject, isYahooDraftDetailObject, isYahooPlayersObject, };
