export declare const knownLeaguesFunctions: {
    espn: (config: ESPNConfig) => Promise<WalterKnownLeague[]>;
    sleeper: (config: SleeperConfig) => Promise<WalterKnownLeague[]>;
    yahoo: (config: YahooConfig) => Promise<WalterKnownLeague[]>;
};
