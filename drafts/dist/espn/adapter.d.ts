export declare const getNumberOfTeams: (data: EspnLeagueInformation) => number;
/** ESPN does not support dynasty leagues, but we have left isDynastyLeague in case
 * that ever changes. Right now it should always return `false`.
 */
export declare const isDynastyLeague: () => boolean;
export declare const getDraftType: (data: EspnSettings) => WalterDraftType;
export declare const getStartingAuctionBudget: (data: EspnSettings) => number;
export declare const getRemainingDraftBudget: (teamId: number, budget: number, draft: EspnDraft) => number;
export declare const getDraftOrder: (data: EspnSettings) => number[];
/** For now, getPickedPlayers just returns objects with `id` and `fullName` properties,
 * but we may want to add more properties in the future based on how this information is
 * intended to be consumed.
 */
export declare const getPickedPlayers: (draft: EspnDraft, playerData: EspnPlayers) => PickedPlayer[];
export declare const getWhichTeamPickedPlayer: (draft: EspnDraft, playerId: number) => number | null;
export declare const getPlayerPickOrder: (draft: EspnDraft, playerId: number) => number | null;
export declare const getFreeAgentsDuringDraft: (draft: EspnDraft, playerData: EspnPlayers) => PickedPlayer[];
export declare const getPlayerNflTeam: (playerData: EspnPlayer, teams: EspnNflTeams) => string;
export declare const getAverageDraftPosition: (playerId: number, playersData: EspnPlayers) => number;
export declare const getAverageAuctionPrice: (playerId: number, playersData: EspnPlayers) => number;
export declare const getTeams: (data: EspnLeagueInformation, draft: EspnDraft, settings: EspnSettings) => WalterTeam[];
export declare const getRosterLineupSlot: (playerId: number, teamId: number, userRoster: EspnUserLeagueRosters) => string;
export declare const getWalterPlayers: (playersData: EspnPlayers, draftData: EspnDraft, proTeams: EspnNflTeams) => WalterPlayer[];
export declare const getLeagueName: (data: EspnLeagueInformation) => string;
export declare const getTeamName: (data: EspnLeagueInformation, swid: string) => string;
export declare const getTeamId: (data: EspnLeagueInformation, swid: string) => number;
export declare const getLeagueSettings: (data: EspnSettings) => WalterLeagueSettings;
export declare const getTeamsFromESPNLeagueInformation: (rosters: EspnLeagueInformation, playerInformation: EspnPlayers, userRoster: EspnUserLeagueRosters) => WalterLeagueTeamRoster[];
