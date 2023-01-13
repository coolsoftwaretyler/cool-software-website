import * as YahooAdapter from './yahoo/adapter';
import * as YahooDataFetching from './yahoo/dataFetching';
/**
 * getYahooUserData can take an YahooConfig object and return an array of WalterKnownLeagues,
 * using some Yahoo data endpoints and data adapter functions.
 *
 * @param config
 * @returns
 */
export const getYahooUserGUID = async (config) => {
    const { accessToken } = config;
    // Then, we want to use getUserData with the token
    const userDataXMLString = await YahooDataFetching.getUserData(accessToken);
    const userGUID = YahooAdapter.getUserGUID(userDataXMLString.data);
    return userGUID;
};
