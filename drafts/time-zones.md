Game betting tool - we get game betting lines from SportsData. We use a separate enpdoitn to get the splits - how many bets, percent of money on either bet (over/under)

Game betting lines worked well. Sports data gives us the time (always in EST). We need it to match with NBA game sin Sanityw hich are in UTC. AT the point of ingestion, convert est to too utc. aws i not in eastern time zone. change the time zone. when things run in aws, it's using time zone

doing conversion was converting to local time zone. so initially was converting to local

game betting splits data would say game is on march 11 at midnight. so can't convert them both to utc, because we're matching on the day.

a game that's at 1030 tonight is march 12th utc.

sports data thinks it's march 11 at 4 in the morning utc.

take the utc time to convert to eastern standard time.

what happened when it was going wrong: could not find games. could not match splits to games in sanity. started by converting both to utc.

- since sports data didn't give us the time, the conversion was getting the dates wrong.

the issue is: the sports data time is always est.

conversions were not

- solution: ended up converting the utc to standard time.
- use sportsdata game ids.
- fundamentally the issue is that SportsData is using inconsistent datettimes.
- the big problem is datetimes and dates are two different types of representation, and you can't
