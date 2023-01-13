export declare const setConfiguration: (accessToken: string, refreshToken: string, expirationTimestamp: number) => PlatformConfig;
export declare const getNewConfig: (refreshToken: string) => Promise<{
    newAccessToken: any;
    newExpirationTimestamp: number;
}>;
export declare const getYahooConfiguration: () => PlatformConfig;
export declare const getUserData: (token: string) => Promise<any>;
export declare const getUserNFLLeagues: (token: string) => Promise<any>;
export declare const getLeagueTeams: (leagueKey: string, token: string) => Promise<any>;
export declare const getLeagueDraft: (leagueKey: string, token: string) => Promise<any>;
export declare const getLeagueSettings: (leagueKey: string, token: string) => Promise<any>;
export declare const getTeamsInLeague: (leagueKey: string, token: string) => Promise<any>;
