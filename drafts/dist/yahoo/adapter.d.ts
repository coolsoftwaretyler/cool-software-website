export declare const getUserGUID: (data: string) => string;
export declare const getUserLeagues: (data: string) => YahooLeague[];
export declare const getTeamInfo: (userId: string, data: string) => YahooTeamInfo;
export declare const getDraftPicks: (teamKey: string, data: string) => WalterDraftState;
export declare const getLeagueSettings: (data: string) => WalterLeagueSettings;
export declare const getTeamsInLeague: (data: string) => WalterLeagueTeamRoster[];
