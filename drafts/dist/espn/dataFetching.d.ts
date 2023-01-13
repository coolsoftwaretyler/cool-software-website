declare const getEspnConfiguration: () => {
    espn_s2: string;
    SWID: string;
};
declare const setConfiguration: (espn_s2: string, SWID: string) => {
    espn_s2: string;
    SWID: string;
};
interface RequestOptions {
    leagueId: string;
    view?: string;
    year: string;
    fantasyFilter?: boolean;
    userTeamId?: number;
}
declare const espnRequest: (options: RequestOptions) => Promise<unknown>;
declare const getEspnLeagueInformation: (options: RequestOptions) => Promise<unknown>;
declare const getEspnSettings: (options: RequestOptions) => Promise<unknown>;
declare const getEspnDraftDetail: (options: RequestOptions) => Promise<unknown>;
declare const getEspnPlayerInformation: (options: RequestOptions) => Promise<unknown>;
declare const getEspnProTeamsInformation: (year: string) => Promise<unknown>;
declare const getLeagueNames: (leagues: string[]) => Promise<unknown>;
declare const getEspnUserRoster: (options: RequestOptions) => Promise<unknown>;
export { espnRequest, getEspnConfiguration, getLeagueNames, setConfiguration, getEspnLeagueInformation, getEspnSettings, getEspnDraftDetail, getEspnPlayerInformation, getEspnProTeamsInformation, getEspnUserRoster, };
