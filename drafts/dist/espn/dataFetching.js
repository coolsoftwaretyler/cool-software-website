/* eslint-disable camelcase */
import axios from 'axios';
import { proxiedURL } from '../cachingHelper';
// Change this to either 'aws', 'local', or 'espn'
const source = 'espn';
const configuration = {
    espn_s2: '',
    SWID: '',
};
const getEspnConfiguration = () => configuration;
const setConfiguration = (espn_s2, SWID) => {
    configuration.espn_s2 = espn_s2;
    configuration.SWID = SWID;
    return configuration;
};
const rejectIfConfigurationNotSet = () => {
    if (!configuration.espn_s2 || !configuration.SWID) {
        throw new Error('ESPN S2 and SWID must be set before making requests');
    }
};
const espnRequest = (options) => new Promise((resolve, reject) => {
    const { leagueId, view, year, fantasyFilter, userTeamId } = options;
    const urls = {
        espn: `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}`,
        local: `http://localhost:9090/espn/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}`,
        aws: `http://18.224.71.205/espn/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}`,
    };
    // Select the URL from the source,
    // and then proxy it if the caching proxy is enabled.
    const urlToUse = proxiedURL(urls[source]);
    // log.debug(`espnRequest | urlToUse = ${urlToUse}`)
    rejectIfConfigurationNotSet();
    if (!leagueId) {
        reject(new Error('espnRequest: leagueId is required'));
    }
    if (!year) {
        reject(new Error('espnRequest: year is required'));
    }
    const headersWithoutFilter = {
        'Content-Type': 'application/json',
        Cookie: `espn_s2=${configuration.espn_s2}; SWID=${configuration.SWID};`,
    };
    const headersWithFilter = {
        'Content-Type': 'application/json',
        Cookie: `espn_s2=${configuration.espn_s2}; SWID=${configuration.SWID};`,
        'X-Fantasy-Filter': '{"players": {"limit": 0}}',
    };
    const rosterParam = userTeamId || '';
    axios
        .get(urlToUse, {
        headers: fantasyFilter ? headersWithFilter : headersWithoutFilter,
        params: {
            view,
            rosterForTeamId: rosterParam,
        },
        withCredentials: false,
    })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
});
const getEspnLeagueInformation = (options) => new Promise((resolve, reject) => {
    const { leagueId, year } = options;
    if (!leagueId) {
        reject(new Error('espnRequest: leagueId is required'));
    }
    if (!year) {
        reject(new Error('espnRequest: year is required'));
    }
    espnRequest(options)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => {
        reject(error);
    });
});
const getEspnSettings = (options) => new Promise((resolve, reject) => {
    const optionsWithMSettings = { ...options, view: 'mSettings' };
    espnRequest(optionsWithMSettings)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => {
        reject(error);
    });
});
const getEspnDraftDetail = (options) => new Promise((resolve, reject) => {
    const optionsWithDraftDetail = { ...options, view: 'mDraftDetail' };
    espnRequest(optionsWithDraftDetail)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => {
        reject(error);
    });
});
const getEspnPlayerInformation = (options) => new Promise((resolve, reject) => {
    const optionsWithFantasyFilter = { ...options, view: 'kona_player_info', fantasyFilter: true };
    espnRequest(optionsWithFantasyFilter)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => {
        reject(error);
    });
});
const getEspnProTeamsInformation = (year) => new Promise((resolve, reject) => {
    const urls = {
        espn: `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}?view=proTeamSchedules_wl`,
        local: `http://localhost:9090/espn/apis/v3/games/ffl/seasons/${year}?view=proTeamSchedules_wl`,
        aws: `http://18.224.71.205/espn/apis/v3/games/ffl/seasons/${year}?view=proTeamSchedules_wl`,
    };
    const urlToUse = urls[source];
    axios
        .get(urlToUse)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => reject(error));
});
const getLeagueNames = (leagues) => new Promise((resolve, reject) => {
    const leagueNames = [];
    const promises = [];
    leagues.forEach((league) => {
        const options = {
            leagueId: league,
            year: '2021',
            view: '',
        };
        promises.push(espnRequest(options));
    });
    Promise.all(promises)
        .then((leagueSettings) => {
        leagueSettings.forEach((response) => {
            const league = response.data;
            leagueNames.push(league.settings.name);
        });
        // log.debug(`getEspnProTeamsInformation | leagueNames = ${leagueNames}`)
        resolve(leagueNames);
    })
        .catch((error) => reject(error));
});
const getEspnUserRoster = async (options) => new Promise((resolve, reject) => {
    const { leagueId, year, userTeamId } = options;
    if (!leagueId) {
        reject(new Error('espnRequest: leagueId is required'));
    }
    if (!year) {
        reject(new Error('espnRequest: year is required'));
    }
    if (!userTeamId) {
        reject(new Error('espnRequest: userTeamId is required'));
    }
    const optionsWithRoster = { ...options, view: 'mRoster' };
    espnRequest(optionsWithRoster)
        .then((response) => {
        const { data } = response;
        resolve(data);
    })
        .catch((error) => {
        reject(error);
    });
});
export { espnRequest, getEspnConfiguration, getLeagueNames, setConfiguration, getEspnLeagueInformation, getEspnSettings, getEspnDraftDetail, getEspnPlayerInformation, getEspnProTeamsInformation, getEspnUserRoster, };
