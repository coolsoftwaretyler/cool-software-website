// // Read a csv file line by line at athena-data/sleeper-leagues-and-settings.csv
// import * as fs from 'fs'
// import * as readline from 'readline'
// import { parse } from 'csv-parse'
// import * as EspnAdapter from './dist/espn/adapter.js'
// import * as SleeperAdapter from './dist/sleeper/adapter.js'
// import * as YahooAdapter from './dist/yahoo/adapter.js'

function encodeSleeperSettings(settings) {
  const {
    numTeams,
    scoring,
    startingQbs,
    startingRbs,
    startingWrs,
    startingTes,
    startingFlex,
    startingSuperFlex,
    startingKickers,
    startingDefense,
  } = settings;

  return `num_teams=${numTeams}&scoring=${scoring}&starting_qbs=${startingQbs}&starting_rbs=${startingRbs}&starting_wrs=${startingWrs}&starting_tes=${startingTes}&starting_flex=${startingFlex}&starting_superflex=${startingSuperFlex}&starting_kickers=${startingKickers}&starting_defense=${startingDefense}`;
}

// // Sleeper
// const rl = readline.createInterface({
//   input: fs.createReadStream('athena-data/sleeper-leagues-and-settings.csv'),
//   crlfDelay: Infinity,
// })

// const leagues = {}

// let iterator = 0
// rl.on('line', (line) => {
//   if (iterator !== 0) {
//     const leagueId = line.split(',')[0]
//     // Settings are all the other ones combined
//     const settings = line.split(',').slice(1).join(',')
//     console.log(settings)
//     // If we don't know this league id, add it to the leagues object
//     if (!leagues[leagueId]) {
//       try {
//         const parsedSettings = JSON.parse(settings.slice(1, -1))
//         console.log(parsedSettings)
//         const settingsObject = SleeperAdapter.getLeagueSettings(parsedSettings)

//         const encodedSettings = encodeSleeperSettings(settingsObject)

//         leagues[leagueId] = encodedSettings
//       } catch (e) {
//         console.log('error', leagueId)
//         console.log(e)
//       }
//     }
//   }

//   iterator += 1
// })

// // Log the leagueIdSet number of items
// rl.on('close', () => {
//   console.log(`leagues: ${Object.keys(leagues).length}`)
//   // Write the leagues object to a file
//   fs.writeFileSync('athena-data/sleeper-leagues-and-settings.json', JSON.stringify(leagues))
// })

// ESPN
// const rl = readline.createInterface({
//   input: fs.createReadStream('athena-data/espn-leagues-and-settings.csv'),
//   crlfDelay: Infinity,
// })

// const leagues = {}

// let iterator = 0
// rl.on('line', (line) => {
//   if (iterator !== 0) {
//     const leagueId = line.split(',')[0]
//     // Settings are all the other ones combined
//     const settings = line.split(',').slice(1).join(',')
//     // Remove double-quotes
//     const settingsWithRightQuotes = settings.replace(/""/g, '"')
//     // If we don't know this league id, add it to the leagues object
//     if (!leagues[leagueId]) {
//       try {
//         const parsedSettings = JSON.parse(settingsWithRightQuotes.slice(1, -1))
//         const settingsObject = EspnAdapter.getLeagueSettings(parsedSettings)

//         const encodedSettings = encodeSleeperSettings(settingsObject)

//         leagues[leagueId] = encodedSettings
//       } catch (e) {
//         console.log('error', leagueId)
//         console.log(e)
//       }
//     }
//   }

//   iterator += 1
// })

// // Log the leagueIdSet number of items
// rl.on('close', () => {
//   console.log(`leagues: ${Object.keys(leagues).length}`)
//   // Write the leagues object to a file
//   fs.writeFileSync('athena-data/espn-leagues-and-settings.json', JSON.stringify(leagues))
// })

// // Parse the yahoo-leagues-and-settings.csv file with csv-parse
// const parser = parse({
//   columns: true,
//   delimiter: ',',
//   skip_empty_lines: true,
// })

// const leagues = {}

// parser.on('readable', () => {
//   let record
//   while ((record = parser.read())) {
//     const leagueId = record.league_id
//     const { data } = record
//     if (!leagues[leagueId]) {
//       try {
//         const settingsObject = YahooAdapter.getLeagueSettings(data)

//         const encodedSettings = encodeSleeperSettings(settingsObject)

//         leagues[leagueId] = encodedSettings
//       } catch (e) {
//         console.log('error', leagueId)
//         console.log(e)
//       }
//     }
//   }
// })

// parser.on('error', (err) => {
//   console.error(err.message)
// })

// parser.on('end', () => {
//   console.log(`leagues: ${Object.keys(leagues).length}`)
//   // Write the leagues object to a file
//   fs.writeFileSync('athena-data/yahoo-leagues-and-settings.json', JSON.stringify(leagues))
// })

// fs.createReadStream('athena-data/yahoo-leagues-and-settings.csv').pipe(parser)

// Import encoded-espn-leagues-and-settings.json
// Needs to be .cjs
const fs = require("fs");
const encodedEspnLeaguesAndSettings = require("../../league-sync/athena-data/encoded-espn-leagues-and-settings.json");
const encodedSleeperLeaguesAndSettings = require("../../league-sync/athena-data/encoded-sleeper-leagues-and-settings.json");
const encodedYahooLeaguesAndSettings = require("../../league-sync/athena-data/encoded-yahoo-leagues-and-settings.json");
// Join the objects together

const encodedLeaguesAndSettings = {
  ...encodedEspnLeaguesAndSettings,
  ...encodedSleeperLeaguesAndSettings,
  ...encodedYahooLeaguesAndSettings,
};

console.log(
  `There are ${Object.keys(encodedLeaguesAndSettings).length} leagues`
);

// Look through all the values and count the occurrences of each setting

const settings = {};

Object.values(encodedLeaguesAndSettings).forEach((encodedSettings) => {
  if (settings[encodedSettings]) {
    settings[encodedSettings] += 1;
  } else {
    settings[encodedSettings] = 1;
  }
});

// Find the three most common settings

const settingsArray = Object.entries(settings);

const sortedSettingsArray = settingsArray.sort((a, b) => b[1] - a[1]);

const topThreeSettings = sortedSettingsArray.slice(0, 10);

console.log(topThreeSettings);

// Write the settings object to a file

fs.writeFileSync(
  "athena-data/encoded-leagues-and-settings.json",
  JSON.stringify(settings)
);
