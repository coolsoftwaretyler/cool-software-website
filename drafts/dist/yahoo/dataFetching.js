/* eslint-disable camelcase */
import axios from 'axios';
import { proxiedURL } from '../cachingHelper';
// Change this to either 'aws', 'local', or 'yahoo'
const source = 'yahoo';
const urls = {
    yahoo: 'https://fantasysports.yahooapis.com',
    local: 'http://localhost:9090/yahoo',
    aws: 'http://18.224.71.205/yahoo',
};
const configuration = {
    accessToken: '',
    refreshToken: '',
    expirationTimestamp: 0,
};
// eslint-disable-next-line max-len
export const setConfiguration = (accessToken, refreshToken, expirationTimestamp) => {
    configuration.accessToken = accessToken;
    configuration.refreshToken = refreshToken;
    configuration.expirationTimestamp = expirationTimestamp;
    return configuration;
};
export const getNewConfig = async (refreshToken) => {
    // eslint-disable-next-line max-len
    const url = proxiedURL(`https://us-central1-walter-picks-dev.cloudfunctions.net/getYahooRefreshToken?token=${refreshToken}`);
    try {
        const response = await axios.get(url);
        const { access_token, expires_in } = response.data;
        return {
            newAccessToken: access_token,
            newExpirationTimestamp: Date.now() + expires_in * 1000,
        };
    }
    catch (error) {
        throw new Error(`Error in league-sync getNewConfig: ${error}`);
    }
};
export const getYahooConfiguration = () => {
    // If the expirationTimestamp is still 0, we haven't been initialized yet
    // Or, If the expiration timestamp is still in the future,
    // Return the configuration object.
    if (configuration.expirationTimestamp === 0 || Date.now() < configuration.expirationTimestamp) {
        return configuration;
    }
    // Otherwise, we need to refresh the token.
    // In which case, let's return an empty PlatformConfig object,
    // But with the `refreshToken` value, which we can use with getNewConfig to get a new access token.
    return {
        accessToken: '',
        refreshToken: configuration.refreshToken,
        expirationTimestamp: 0,
    };
};
export const getUserData = async (token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/users;use_login=1`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
export const getUserNFLLeagues = async (token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
export const getLeagueTeams = async (leagueKey, token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/league/${leagueKey}/teams`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
export const getLeagueDraft = async (leagueKey, token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/league/${leagueKey}/draftresults`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
export const getLeagueSettings = async (leagueKey, token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/league/${leagueKey}/settings`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
export const getTeamsInLeague = async (leagueKey, token) => {
    const url = proxiedURL(`${urls[source]}/fantasy/v2/league/${leagueKey}/teams/roster`);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error;
    }
};
