# usBabyNames.js
Node.js / promise-based data provider about name usage of babies born 1880-2014 in the United States of America.

[![NPM version][npm-image]][npm-url]
# New!
**2016-05-08**: <a href="https://en.wikipedia.org/wiki/D._Richard_Hipp">Richard Hipp</a> (of SQLite fame) was kind enough to write in and suggest swapping "INTEGER" for "INT" in the sqlite3 creation script. <a href="https://www.sqlite.org/lang_createtable.html#rowid">This makes for a much smaller database</a>. Thanks!

**2016-05-07**: As of May 5th, 2016, the US Social Security Administration has updated their files with <a href="https://www.ssa.gov/OACT/babynames/index.html">32952 new name entries for the year 2015</a>. We have updated both the Sqlite3 database and the corresponding output accordingly.


# About
Built on <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Administration baby names files</a>, usBabyNames.js returns interesting historical data on baby name usage from 1880-2015. With almost two million total entries packaged within a sqlite3 database, each record contains the following:
- Name
- Sex
- Number of births that year
- Rank for that year

This allows you to easily do the following:
- Identify naming trends based on real data
- See the top 10 names for a year
- Track the popularity of a name over time
- Sort by male vs. female name usage for specific name
- See the number of children given the name "Jonathan" in 1975
- Calculate the percentage of childen named "Jonathan" since 1975
- Whatever you want, really. Slice and dice however you like

# Install
```
npm install usbabynames --save
```

# Usage
``` js
var babyNames = require('usbabynames');

var theNames = babyNames.getByName('jonathan')
	.then(function(data){
		console.log('names=',data)
	});
```

# API
**.getByName(name)** returns name data for all years for a given name

**.getByYear(year)** returns name data for a specific year

**.getById(id)** returns a specific name record by id

**.get(params)** returns filtered name data where params are:
``` js
{
  id: int,
  name: string,
  year: int,
  yearRange: {start: int, end: int},
  sex: string (M/F),
  rank: int,
  rankRange: {start: int, end: int},
  births: int,
  birthsRange: {start: int, end: int},
  unique: boolean
}
```
Output from all the functions above looks like this:
``` js
[
	{ id: 784623,
	name: 'jonathan',
	sex: 'M',
	births: 10919,
	rank: 30,
	year: 1975 }
]
```
**.getNameRankAndBirthsByYear(name, params)** is useful for creating graphs. Params are:
```
{
	sex: boolean (M/F),
	getEmptyYears: boolean (include years even with 0 births)
}
```
Output for .getNameRankAndBirthsByYear("kanye") looks like:
``` js
{ '2002': { births: 5, rank: 11584 },
  '2003': { births: 87, rank: 1491 },
  '2004': { births: 507, rank: 489 },
  '2005': { births: 202, rank: 893 },
  '2006': { births: 101, rank: 1503 },
  '2007': { births: 53, rank: 2425 },
  '2008': { births: 81, rank: 1815 },
  '2009': { births: 64, rank: 2128 },
  '2010': { births: 30, rank: 3575 },
  '2011': { births: 35, rank: 3200 },
  '2012': { births: 34, rank: 3262 },
  '2013': { births: 40, rank: 2861 },
  '2014': { births: 22, rank: 4429 } }
```

# Example Application
<a href="https://github.com/jonroig/exampleUsBabyNamesVisualization.js">exampleUsBabyNamesVisualization.js</a>: a really basic example of usBabyNames.js, express.js, and Google charts.js.

# US Baby Names 1880-2015 Sqlite3 Database
Many people find the US Social Security Administration names files more useful in a sqlite database. For raw access to sql tables, just clone this repository and start querying.

I've done all the "hard" work of exporting all the historical United States birth name data from the original files (/raw_name_source) into a sqlite database. (It's not a hard thing to do, per se, it's just time consuming to load all the data... like over an hour running full speed ahead on a Macbook Pro with a SSD.) If you're curious how I did it, take a look at sqllite/loader.js. It ain't nothin' fancy. Presumably, it wouldn't be hard to modify it to load yob (year of birth) files into the database of your choice.

This database is 100% public domain and freely available for whatever purposes you like. Enjoy! Thanks SSA!

You can access the baby name sqlite database directly from the command line like so:
```
sqlite3 sqlite/us-name-data.sqlite

select * from usNameData WHERE name = 'jonathan' AND year = 1975 AND sex = 'M';

select * from usNameData WHERE name = 'jonathan' AND sex = 'M' ORDER BY year DESC;
```

# Data Source: Government Fine Print
.. from the Original YOB Source Files:

National Data on the relative frequency of given names in the population of U.S. births where the individual has a Social Security Number

(Tabulated based on Social Security records as of March 6, 2016)

For each year of birth YYYY after 1879, we created a comma-delimited file called yobYYYY.txt. Each record in the individual annual files has the format "name,sex,number," where name is 2 to 15 characters, sex is M (male) or F (female) and "number" is the number of occurrences of the name. Each file is sorted first on sex and then on number of occurrences in descending order. When there is a tie on the number of occurrences, names are listed in alphabetical order. This sorting makes it easy to determine a name's rank. The first record for each sex has rank 1, the second record for each sex has rank 2, and so forth.

To safeguard privacy, we restrict our list of names to those with at least 5 occurrences.

# Why
Written over a weekend in early 2016, usBabyNames.js was created when Jon Roig (<a href="https://twitter.com/runnr_az">@runnr_az</a>) found existing baby name data websites / apps / etc... to be totally ridiculous. Since all of these other resources build off the same central resource, <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Administration baby names files</a>, and I was parsing the data anyway, I thought it'd be fun to learn how to package the whole thing up as an NPM module for anyone to use in the future.

# To Do
Maybe add the state by state birth records?


[npm-image]: https://img.shields.io/npm/v/usbabynames.svg?style=flat-square
[npm-url]: https://npmjs.org/package/usbabynames
