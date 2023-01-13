/* eslint-disable camelcase */
const getUserIdFromSleeperUser = (sleeperUser) => sleeperUser.user_id;
const getRosterNameByUserId = (rosters, userId) => {
    const roster = rosters.find((r) => r.user_id === userId);
    // Throw an error if no roster match
    if (!roster) {
        throw new Error(`No roster found for userId: ${userId}`);
    }
    // If there is a roster.metadata.team_name, use that
    if (roster && roster.metadata && roster.metadata.team_name) {
        return roster.metadata.team_name;
    }
    // Otherwise, return roster.display_name
    return roster.display_name;
};
const sleeperPickToWalterPlayer = (sleeperPick) => {
    const { metadata, player_id, picked_by, pick_no } = sleeperPick;
    const { first_name, last_name } = metadata;
    return {
        fullName: `${first_name} ${last_name}`,
        pickOrder: pick_no,
        sleeperId: player_id,
        teamId: picked_by,
    };
};
const getLeagueSettings = (data) => {
    const { settings, scoring_settings, roster_positions } = data;
    const { num_teams } = settings;
    const { rec } = scoring_settings;
    let scoring;
    if (rec === 1) {
        scoring = 'ppr';
    }
    else if (rec === 0.5) {
        scoring = 'half_ppr';
    }
    else if (rec === 0) {
        scoring = 'standard';
    }
    else {
        scoring = 'ppr';
    }
    const positionMap = {};
    roster_positions.forEach((pos) => {
        if (pos in positionMap) {
            positionMap[pos] += 1;
        }
        else {
            positionMap[pos] = 1;
        }
    });
    const startingQbs = positionMap.QB || 0;
    const startingRbs = positionMap.RB || 0;
    const startingWrs = positionMap.WR || 0;
    const startingTes = positionMap.TE || 0;
    const startingFlex = positionMap.FLEX || 0;
    const startingSuperFlex = positionMap.SUPER_FLEX || 0;
    const startingKickers = positionMap.K || 0;
    const startingDefense = positionMap.DEF || 0;
    const bench = positionMap.BN || 0;
    return {
        platform: 'sleeper',
        scoring,
        numTeams: num_teams,
        startingQbs,
        startingRbs,
        startingWrs,
        startingTes,
        startingFlex,
        startingSuperFlex,
        startingKickers,
        startingDefense,
        bench,
    };
};
const sleeperTeamsToWalterTeams = (sleeperTeams) => {
    const walterTeams = sleeperTeams.map((t) => {
        const { roster_id, owner_id, players, starters, co_owners } = t;
        const walterPlayers = players.map((p) => ({
            sleeperId: p,
        }));
        const walterStarters = starters.map((p) => ({
            sleeperId: p,
        }));
        const walterBench = walterPlayers.filter((teamPlayer) => walterStarters.every((teamStarter) => teamStarter.sleeperId !== teamPlayer.sleeperId));
        const owners = co_owners ? [owner_id, ...co_owners] : [owner_id];
        return {
            teamId: roster_id,
            owners,
            players: walterPlayers,
            teamName: `Team ${roster_id}`,
            starters: walterStarters,
            bench: walterBench,
        };
    });
    return walterTeams;
};
export { getUserIdFromSleeperUser, getRosterNameByUserId, sleeperPickToWalterPlayer, getLeagueSettings, sleeperTeamsToWalterTeams, };
