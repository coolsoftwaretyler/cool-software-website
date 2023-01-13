export declare const settingsFunctions: {
    espn: (config: ESPNConfig, leagueId: string, year: string) => Promise<WalterLeagueSettings>;
    sleeper: (config: SleeperConfig, leagueId: string) => Promise<WalterLeagueSettings>;
    yahoo: (config: YahooConfig, leagueId: string) => Promise<WalterLeagueSettings>;
};
