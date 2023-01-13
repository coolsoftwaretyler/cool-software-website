export declare const leagueRostersFunctions: {
    espn: (config: ESPNConfig, leagueId: string, year: string) => Promise<WalterLeagueTeamRoster[]>;
    sleeper: (leagueId: string) => Promise<WalterLeagueTeamRoster[]>;
    yahoo: (config: YahooConfig, leagueId: string) => Promise<WalterLeagueTeamRoster[]>;
};
