declare const getUserIdFromSleeperUser: (sleeperUser: SleeperUser) => string;
declare const getRosterNameByUserId: (rosters: SleeperRoster[], userId: string) => string;
declare const sleeperPickToWalterPlayer: (sleeperPick: SleeperPick) => WalterPlayer;
declare const getLeagueSettings: (data: SleeperLeagueSettings) => WalterLeagueSettings;
declare const sleeperTeamsToWalterTeams: (sleeperTeams: any) => WalterLeagueTeamRoster[];
export { getUserIdFromSleeperUser, getRosterNameByUserId, sleeperPickToWalterPlayer, getLeagueSettings, sleeperTeamsToWalterTeams, };
