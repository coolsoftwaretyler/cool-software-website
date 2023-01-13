import axios from 'axios';
import { proxiedURL } from '../cachingHelper';
const configuration = {
    userId: '',
};
const getSleeperConfiguration = () => configuration;
const setConfiguration = (userId) => {
    configuration.userId = userId;
    return configuration;
};
const getUserDataByUsername = async (username) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/user/${username}`);
    const { data } = await axios.get(url);
    return data;
};
const getLeagueDataByUserId = async (userId, year) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${year}`);
    const { data } = await axios.get(url);
    return data;
};
const getLeagueUsersByLeagueId = async (leagueId) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const { data } = await axios.get(url);
    return data;
};
const getAllDraftsForUser = async (userId, year) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/user/${userId}/drafts/nfl/${year}`);
    const { data } = await axios.get(url);
    return data;
};
const getAllDraftsForLeague = async (leagueId) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/league/${leagueId}/drafts`);
    const { data } = await axios.get(url);
    return data;
};
const getPicksForDraft = async (draftId) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
    const { data } = await axios.get(url);
    return data;
};
const getLeague = async (leagueId) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/league/${leagueId}`);
    const { data } = await axios.get(url);
    return data;
};
const getTeamsInLeague = async (leagueId) => {
    const url = proxiedURL(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const { data } = await axios.get(url);
    return data;
};
export { getSleeperConfiguration, setConfiguration, getUserDataByUsername, getLeagueDataByUserId, getLeagueUsersByLeagueId, getAllDraftsForUser, getAllDraftsForLeague, getPicksForDraft, getLeague, getTeamsInLeague, };
