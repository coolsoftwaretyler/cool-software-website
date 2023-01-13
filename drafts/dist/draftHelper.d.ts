export declare const draftFunctions: {
    espn: (config: ESPNConfig, leagueId: string, year: string) => Promise<WalterDraftState>;
    sleeper: (config: SleeperConfig, leagueId: string) => Promise<WalterDraftState>;
    yahoo: (config: YahooConfig, leagueId: string) => Promise<WalterDraftState>;
};
