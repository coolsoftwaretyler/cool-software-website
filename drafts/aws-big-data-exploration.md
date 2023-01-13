Tried to see if it matters to process ec2:

https://stackoverflow.com/questions/52785580/read-a-file-line-by-line-using-lambda-s3
https://nodejs.org/api/readline.html

Locally: 145.8mb 31s

t2.micro: 145.8mb 31.428s

t2.small: 145.8mb 70.234s

t2.medium: 145.8mb 32.67s

t2.large: 145.8mb 38.826s

So more cpu/ram doesn't seem to make a huge impact. Trying t3 for better network speeds

t3.medium: 145.8mb 60.217

So network speeds don't seem to make a huge difference

c4.large: 145.8mb 36.818

Ok, so the different classes don't seem to matter either.

s3://walterpicks-glue-sample-dataset

Youtube AWS Glue tutorial: https://www.youtube.com/watch?v=dQnRP6X8QAU

Compare Glue vs EMR: https://www.youtube.com/watch?v=7Xstz6Qo-pM - ETL tool, no provisioning like with EMR. EMR requires more understanding of clustered computing. Glue is a little more plug-n-play.

permissions are annoying but we have to get it right - want to come back and dial in on IAM roles. Can use excaliber to draw things.

ran into some bugs, this looked interesting but also retrying just worked:

- http://pause.run/aws/aws-glue-error/

S3 -> Transform filter matching `league_sync_axios_respone` -> drop duplicates -> s3 seems to be weirdly invlating data?

Input for that:

```sh
aws s3 ls --summarize --human-readable --recursive s3://test-wp-logtail-archive-decompressed
2022-11-22 11:59:12    0 Bytes input/
2022-11-22 11:59:27   26.6 MiB input/2022-08-31T21:59:10Z-2022-08-31T22:59:10Z.json
2022-11-22 11:59:27   12.9 GiB input/2022-09-13T17:53:10Z-2022-09-13T18:53:10Z.json
2022-11-22 11:59:27  287.2 MiB input/2022-10-05T20:01:47Z-2022-10-05T20:06:21Z.json
2022-11-22 11:59:27    1.5 GiB input/2022-11-13T14:22:14Z-2022-11-13T15:22:14Z.json

Total Objects: 5
   Total Size: 14.6 GiB
```

Output:

```sh
aws s3 ls --summarize --human-readable --recursive s3://test-wp-logtail-league-sync-axios-responses
2022-11-22 13:51:55    1.0 GiB run-1669149467852-part-r-00000
2022-11-22 13:56:37    1.0 GiB run-1669149467852-part-r-00001
2022-11-22 13:51:55  968.1 MiB run-1669149467852-part-r-00002
2022-11-22 13:51:48    1.1 GiB run-1669149467852-part-r-00003
2022-11-22 13:51:53    1.3 GiB run-1669149467852-part-r-00004
2022-11-22 13:51:54    1.3 GiB run-1669149467852-part-r-00005
2022-11-22 13:51:50  973.1 MiB run-1669149467852-part-r-00006
2022-11-22 13:56:43    1.0 GiB run-1669149467852-part-r-00007
2022-11-22 13:51:50  932.5 MiB run-1669149467852-part-r-00008
2022-11-22 13:51:53    1.0 GiB run-1669149467852-part-r-00009
2022-11-22 13:56:39    1.1 GiB run-1669149467852-part-r-00010
2022-11-22 13:51:54    1.0 GiB run-1669149467852-part-r-00011
2022-11-22 13:51:46  979.9 MiB run-1669149467852-part-r-00012
2022-11-22 13:51:52  940.7 MiB run-1669149467852-part-r-00013
2022-11-22 13:51:52  907.0 MiB run-1669149467852-part-r-00014
2022-11-22 13:51:47  743.0 MiB run-1669149467852-part-r-00015
2022-11-22 13:56:39 1006.6 MiB run-1669149467852-part-r-00016
2022-11-22 13:51:47    1.3 GiB run-1669149467852-part-r-00017
2022-11-22 13:51:51  825.9 MiB run-1669149467852-part-r-00018
2022-11-22 13:51:55  865.7 MiB run-1669149467852-part-r-00019
2022-11-22 13:51:47    1.0 GiB run-1669149467852-part-r-00020
2022-11-22 13:57:05  999.3 MiB run-1669149467852-part-r-00021
2022-11-22 13:51:56  991.6 MiB run-1669149467852-part-r-00022
2022-11-22 13:51:51    1.2 GiB run-1669149467852-part-r-00023
2022-11-22 13:51:49    1.1 GiB run-1669149467852-part-r-00024
2022-11-22 13:51:49    1.0 GiB run-1669149467852-part-r-00025
2022-11-22 13:51:50    1.3 GiB run-1669149467852-part-r-00026
2022-11-22 13:56:44  914.8 MiB run-1669149467852-part-r-00027
2022-11-22 13:51:51    1.2 GiB run-1669149467852-part-r-00028
2022-11-22 13:51:53  879.2 MiB run-1669149467852-part-r-00029
2022-11-22 13:56:38  968.3 MiB run-1669149467852-part-r-00030
2022-11-22 13:51:54    1.2 GiB run-1669149467852-part-r-00031
2022-11-22 13:51:52  925.2 MiB run-1669149467852-part-r-00032
2022-11-22 13:51:53  862.0 MiB run-1669149467852-part-r-00033
2022-11-22 13:51:51    1.2 GiB run-1669149467852-part-r-00034
2022-11-22 13:57:03    1.2 GiB run-1669149467852-part-r-00035

Total Objects: 36
   Total Size: 36.9 GiB
```

I'm gonna try re-crawling the output. Maybe there's some kind of metadata associated with it now?

Failed:

```
om.amazonaws.services.glue.model.ValidationException: Value at 'table.storageDescriptor.columns.2.member.type' failed to satisfy constraint: Member must have length less than or equal to 131072 (Service: AWSGlue; Status Code: 400; Error Code: ValidationException; Request ID: 49f34b36-4b50-4a25-b4ef-db7625985d29; Proxy: null) . (Database name: test-wp-logtail-database, Table name: test_wp_logtail_league_sync_axios_responses, Location: s3://test-wp-logtail-league-sync-axios-responses/. For more information, see the column limits in Column Structure:https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-tables.html#aws-glue-api-catalog-tables-Column) (Service: AWSGlue; Status Code: 400; Error Code: ValidationException; Request ID: 49f34b36-4b50-4a25-b4ef-db7625985d29; Proxy: null)
```

Make a new bucket for athena query results: https://s3.console.aws.amazon.com/s3/buckets/test-wp-logtail-athena-results?region=us-east-1&tab=objects

Confirmed that the filter works with `leauge_sync_axios_request` - it's only about 6.4mb of the data

Ok, I've got it working for `leauge_sync_axios_response` only, which is still going to be a lot of data, but it should do two things:

1. Normalize file names so there's no weird schema inference
2. Make files the same, uniform size. Easier to work with. Even if this is all we do, this would make a big difference for our ability to do something like use an https://s3.console.aws.amazon.com/s3/olap?region=us-east-1 or something.
   - We could even set up a lambda on when the bucket is written to and have it process each file and push to a db.
   - That might be a great way to parallelize everything.

But before I bail out on this approach, I want to set up a glue crawler on this output and see if the tables it generates make more sense to me.

- Yes, that made just one taqble change.

Ok, in Athena, to just get 10 rows, it's:

```

Time in queue:
136 ms
Run time:
822 ms
Data scanned:
4.47 MB
```

Then I try:

```
SELECT DISTINCT data FROM "AwsDataCatalog"."test-wp-logtail-database"."test_wp_logtail_league_sync_axios_responses" limit 10;
```

And we get:

```

Time in queue:
205 ms
Run time:
835 ms
Data scanned:
3.20 MB
```

I kind of want to try that with a higher limit. Going to check pricing first.

AWs says it's 7 cents. Let me try limit 100 first.

Limit 100 is:

```

Time in queue:
169 ms
Run time:
905 ms
Data scanned:
15.51 MB
```

limit 1000 is

```
Time in queue:
117 ms
Run time:
11.346 sec
Data scanned:
4.91 GB
```

Ok, no limits, should just be a couple cents here.

```
Time in queue:
134 ms
Run time:
3 min 48.646 sec
Data scanned:
14.58 GB
```

Ok, so I think what I need to end up doing is splitting out by:

1. Platform
2. Type of response
3. Then run schemas for each one
4. Then we can query these things.

Use athena to narrow donw data?

```
SELECT * FROM "AwsDataCatalog"."test-wp-logtail-database"."test_wp_logtail_league_sync_axios_responses" WHERE data LIKE '%?xml version=%';
```

{"gameid":"1","settings":{"name":"Fourth Annual Wins Pool League"},"teams":[{"nickname":"CollectinChecks","location":"Crushin Souls","owners":["{DAFFC527-554D-422A-B879-E3D40F1C1564}"],"abbrev":"$$$$","id":"1"},{"nickname":"Cock","location":"Gods ","owners":["{19CA9E61-D853-489E-8A9E-61D853289E82}"],"abbrev":"PINV","id":"2"},{"nickname":"Williams","location":"Team","owners":["{2834F957-F082-4E11-BF31-0E2AA4DF70D4}"],"abbrev":"WILL","id":"3"},{"nickname":"Unclean!","location":"Forever","owners":[],"abbrev":"SMIT","id":"4"},{"nickname":"Florendo","location":"Team","owners":["{DC86817A-C371-45B4-A76F-7537CAB695B5}"],"abbrev":"FLOR","id":"5"},{"nickname":"is Bae","location":"McVay","owners":["{57CCE7F2-875A-4B42-92B4-1F7907986FF3}"],"abbrev":"ADAM","id":"6"},{"nickname":"Old School","location":"SoCal","owners":["{0CCA1044-FA86-49AC-AC03-2336008D106F}"],"abbrev":"FFG","id":"7"},{"nickname":"Romanowski","location":"Team","owners":["{92540160-DCA5-4F83-86D3-61586F10D392}"],"abbrev":"ROMA","id":"8"},{"nickname":"CHUBB","location":"THIELEN MY","owners":["{8A4EEA96-E3FF-41AC-8EEA-96E3FF31ACA3}"],"abbrev":"8==D","id":"9"},{"nickname":"Ricky","location":"Little","owners":["{B84078D9-8E49-4B61-A02C-76DA01F7E306}","{1F3FB21A-6C23-4B93-BFB2-1A6C23AB931E}"],"abbrev":"GONZ","id":"10"}],"seasonid":"2022","segmentid":"0","members":[{"isleaguemanager":false,"displayname":"Rams_Fans13","id":"{0CCA1044-FA86-49AC-AC03-2336008D106F}"},{"isleaguemanager":false,"displayname":"Sawce11","id":"{19CA9E61-D853-489E-8A9E-61D853289E82}"},{"isleaguemanager":false,"displayname":"Ricogonz8913","id":"{1F3FB21A-6C23-4B93-BFB2-1A6C23AB931E}"},{"isleaguemanager":false,"displayname":"willia8367883","id":"{2834F957-F082-4E11-BF31-0E2AA4DF70D4}"},{"isleaguemanager":false,"displayname":"rams4adam","id":"{57CCE7F2-875A-4B42-92B4-1F7907986FF3}"},{"isleaguemanager":false,"displayname":"TRoper27","id":"{8A4EEA96-E3FF-41AC-8EEA-96E3FF31ACA3}"},{"isleaguemanager":false,"displayname":"Romanowski17","id":"{92540160-DCA5-4F83-86D3-61586F10D392}"},{"isleaguemanager":false,"displayname":"ricogonz13","id":"{B84078D9-8E49-4B61-A02C-76DA01F7E306}"},{"isleaguemanager":false,"displayname":"dodgeballa24","id":"{DAFFC527-554D-422A-B879-E3D40F1C1564}"},{"isleaguemanager":false,"displayname":"stefanez03","id":"{DC86817A-C371-45B4-A76F-7537CAB695B5}"}],"scoringperiodid":"0","id":"1526960","status":{"currentmatchupperiod":"1","isactive":false,"latestscoringperiod":"0"}}

Using Athena like this:

```sql
CREATE TABLE yahoo_league_sync_responses
WITH (
    location ='s3://test-wp-logtail-athena-results/tables/yahoo_league_sync_responses/',
    format = 'PARQUET'
)
AS
SELECT uid, dt, data FROM "AwsDataCatalog"."test-wp-logtail-database"."test_wp_logtail_league_sync_axios_responses" WHERE data LIKE '%?xml version=%';
```

Lets me get just the yahoo/espn/sleeper responses, and write them to PARQUET which is easier for AWS to crawl. Moreover, I was able to run each of those concurrently. It took less than 30 seconds to turn 14.58 gb into three dta sets. AWS CLI tells me the output folder is only 47.5mb large. That's ridiculous.

Still need to make sure the data is untouched, but if this is the way to do it... I think I cracked the problem.

Checking repsonses:

```sql
SELECT COUNT(*) FROM espn_league_sync_responses /* 11671 */
SELECT COUNT(*) FROM sleeper_league_sync_responses /* 4747 */
SELECT COUNT(*) FROM yahoo_league_sync_responses /* 3215 */

/* Total: 19633 for 14 gigs of sample data - this isn't de-duped by user/league, just pure network requests. But even so, percentages look like how I expect */
```

That looks like basically the right proportion.

Up next I need to see if I can split each one out into their respective types of endpoints. _Then_ I can run Glue crawlers to infer schema consistently.

### Sleeper

1. Rosters **mocks**/axios/sleeper-league-854147752295272448-rosters.json
2. Users **mocks**/axios/sleeper-league-854147752295272448-users.json
3. League **mocks**/axios/sleeper-league-854147752295272448.json

Seems to work for users:

```sql
SELECT uid, dt, data FROM sleeper_league_sync_responses WHERE data LIKE '%"display_name"%' limit 10;
```

Rosters:

```sql
SELECT uid, dt, data FROM sleeper_league_sync_responses WHERE data LIKE '%"co_owners"%' limit 10;
```

League:

```sql
SELECT uid, dt, data FROM sleeper_league_sync_responses WHERE data LIKE '%"last_message_id"%' limit 10;
```

### ESPN

Kona players: **mocks**/axios/espn-2022-1913582857-kona_player_info.json
mRoster: **mocks**/axios/espn-2022-1913582857-mRoster-team5.json
mSettings: **mocks**/axios/espn-2022-1913582857-mSettings.json
top level: **mocks**/axios/espn-2022-1913582857-undefined.json

### Yahoo

Users nfl leagues: **mocks**/axios/yahoo-users-use-login-1-games-game-keys-nfl-leagues-6Q2C4BCTIZ5KLVB2T6YROIKEZQ.xml
League teams: **mocks**/axios/yahoo-league-414-l-889584-teams-6Q2C4BCTIZ5KLVB2T6YROIKEZQ.xml
League teams rosters: **mocks**/axios/yahoo-league-414-l-887970-teams-roster-6Q2C4BCTIZ5KLVB2T6YROIKEZQ.xml
league settings:**mocks**/axios/yahoo-league-414-l-887970-settings-6Q2C4BCTIZ5KLVB2T6YROIKEZQ.xml

Set up all of the tables for each one. Now to see if we can appropriatley crawl those locations.

I can query this data really nicely through athena, except nested JSON is kind of a pain to work with, and ESPN's arrays of stat blocks kind of suck. That's going to be the next challenge.

The escape hatch here is that I can at least download the results and parse the files, which is cool.

Ooh, let's use REGEXP_EXTRACT(data, '<league_key>(.\*)<\/league_key>', 1) as league_id, and can use that for other items as well.

Follow up script to analyze:

// // Read a csv file line by line at athena-data/sleeper-leagues-and-settings.csv
// import _ as fs from 'fs'
// import _ as readline from 'readline'
// import { parse } from 'csv-parse'
// import _ as EspnAdapter from './dist/espn/adapter.js'
// import _ as SleeperAdapter from './dist/sleeper/adapter.js'
// import \* as YahooAdapter from './dist/yahoo/adapter.js'

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
} = settings

return `num_teams=${numTeams}&scoring=${scoring}&starting_qbs=${startingQbs}&starting_rbs=${startingRbs}&starting_wrs=${startingWrs}&starting_tes=${startingTes}&starting_flex=${startingFlex}&starting_superflex=${startingSuperFlex}&starting_kickers=${startingKickers}&starting_defense=${startingDefense}`
}

// // Sleeper
// const rl = readline.createInterface({
// input: fs.createReadStream('athena-data/sleeper-leagues-and-settings.csv'),
// crlfDelay: Infinity,
// })

// const leagues = {}

// let iterator = 0
// rl.on('line', (line) => {
// if (iterator !== 0) {
// const leagueId = line.split(',')[0]
// // Settings are all the other ones combined
// const settings = line.split(',').slice(1).join(',')
// console.log(settings)
// // If we don't know this league id, add it to the leagues object
// if (!leagues[leagueId]) {
// try {
// const parsedSettings = JSON.parse(settings.slice(1, -1))
// console.log(parsedSettings)
// const settingsObject = SleeperAdapter.getLeagueSettings(parsedSettings)

// const encodedSettings = encodeSleeperSettings(settingsObject)

// leagues[leagueId] = encodedSettings
// } catch (e) {
// console.log('error', leagueId)
// console.log(e)
// }
// }
// }

// iterator += 1
// })

// // Log the leagueIdSet number of items
// rl.on('close', () => {
// console.log(`leagues: ${Object.keys(leagues).length}`)
// // Write the leagues object to a file
// fs.writeFileSync('athena-data/sleeper-leagues-and-settings.json', JSON.stringify(leagues))
// })

// ESPN
// const rl = readline.createInterface({
// input: fs.createReadStream('athena-data/espn-leagues-and-settings.csv'),
// crlfDelay: Infinity,
// })

// const leagues = {}

// let iterator = 0
// rl.on('line', (line) => {
// if (iterator !== 0) {
// const leagueId = line.split(',')[0]
// // Settings are all the other ones combined
// const settings = line.split(',').slice(1).join(',')
// // Remove double-quotes
// const settingsWithRightQuotes = settings.replace(/""/g, '"')
// // If we don't know this league id, add it to the leagues object
// if (!leagues[leagueId]) {
// try {
// const parsedSettings = JSON.parse(settingsWithRightQuotes.slice(1, -1))
// const settingsObject = EspnAdapter.getLeagueSettings(parsedSettings)

// const encodedSettings = encodeSleeperSettings(settingsObject)

// leagues[leagueId] = encodedSettings
// } catch (e) {
// console.log('error', leagueId)
// console.log(e)
// }
// }
// }

// iterator += 1
// })

// // Log the leagueIdSet number of items
// rl.on('close', () => {
// console.log(`leagues: ${Object.keys(leagues).length}`)
// // Write the leagues object to a file
// fs.writeFileSync('athena-data/espn-leagues-and-settings.json', JSON.stringify(leagues))
// })

// // Parse the yahoo-leagues-and-settings.csv file with csv-parse
// const parser = parse({
// columns: true,
// delimiter: ',',
// skip_empty_lines: true,
// })

// const leagues = {}

// parser.on('readable', () => {
// let record
// while ((record = parser.read())) {
// const leagueId = record.league_id
// const { data } = record
// if (!leagues[leagueId]) {
// try {
// const settingsObject = YahooAdapter.getLeagueSettings(data)

// const encodedSettings = encodeSleeperSettings(settingsObject)

// leagues[leagueId] = encodedSettings
// } catch (e) {
// console.log('error', leagueId)
// console.log(e)
// }
// }
// }
// })

// parser.on('error', (err) => {
// console.error(err.message)
// })

// parser.on('end', () => {
// console.log(`leagues: ${Object.keys(leagues).length}`)
// // Write the leagues object to a file
// fs.writeFileSync('athena-data/yahoo-leagues-and-settings.json', JSON.stringify(leagues))
// })

// fs.createReadStream('athena-data/yahoo-leagues-and-settings.csv').pipe(parser)

// Import encoded-espn-leagues-and-settings.json
// Needs to be .cjs
const fs = require('fs')
const encodedEspnLeaguesAndSettings = require('./athena-data/encoded-espn-leagues-and-settings.json')
const encodedSleeperLeaguesAndSettings = require('./athena-data/encoded-sleeper-leagues-and-settings.json')
const encodedYahooLeaguesAndSettings = require('./athena-data/encoded-yahoo-leagues-and-settings.json')
// Join the objects together

const encodedLeaguesAndSettings = {
...encodedEspnLeaguesAndSettings,
...encodedSleeperLeaguesAndSettings,
...encodedYahooLeaguesAndSettings,
}

console.log(`There are ${Object.keys(encodedLeaguesAndSettings).length} leagues`)

// Look through all the values and count the occurrences of each setting

const settings = {}

Object.values(encodedLeaguesAndSettings).forEach((encodedSettings) => {
if (settings[encodedSettings]) {
settings[encodedSettings] += 1
} else {
settings[encodedSettings] = 1
}
})

// Find the three most common settings

const settingsArray = Object.entries(settings)

const sortedSettingsArray = settingsArray.sort((a, b) => b[1] - a[1])

const topThreeSettings = sortedSettingsArray.slice(0, 10)

console.log(topThreeSettings)

// Write the settings object to a file

fs.writeFileSync('athena-data/encoded-leagues-and-settings.json', JSON.stringify(settings))
