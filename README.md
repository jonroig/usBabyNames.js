# usBabyNames.js: NPM / JS / SQLite: United States Baby Name Data
[![NPM version][npm-image]][npm-url]
&nbsp;&nbsp;[![Node.js CI](https://github.com/jonroig/usBabyNames.js/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/jonroig/usBabyNames.js/actions/workflows/node.js.yml)


Historical database of United States baby names
- NPM module
- Promise-based archictecture / direct db access
- Source: Social Security card applications US births after 1879 / chatGPT
- National data: 1880-2023
- State data: 1910-2023


# About
Built on <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Administration baby names files</a>, usBabyNames.js returns interesting historical data on baby name usage from 1880-2023

National Data: 1880-2023
- 2,114,982 records
- Name
- Sex
- Number of births that year
- Rank for that year
  
State Data: 1910-2023
- 6,504,161 records
- Name
- Sex
- Number of births that year
- Rank
- State

Name Details
- 115,263 records
- Name
- Sex
- Pronunciation
- Country of Origin
- Meaning
- Historical notes

**Usage**
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

# Historical Name Data Usage
``` js
const getByName = async () => {
	const { getByName } = await import('../lib/usBabyNames.mjs');
	const theNames = await getByName('debbie');
	console.log('theNames', theNames);
};

getByName();
```


# Name Details Usage
``` js
const getDetailed = async () => {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theDetails = await usBabyNames.getDetailed('jonathan', 'm');
	console.log('theDetails', theDetails);
  };
  
getDetailed();
```

# Historical Name Data API
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
  sex: string (m/f),
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
	sex: 'm',
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

# Detailed Name Data API

.getDetailed(name, sex) returns advanced data about a given name including pronunciation, country of origin, meaning, and notes.
``` js
[
  {
    id: 88737,
    name: 'bertha',
    sex: 'm',
    nameData: {
	"name": "Bertha",
	"sex": "female",
	"pronunciation": "/ˈbɜːrθə/",
	"country": [
		"Germany",
			"England"
	],
	"meaning": [
		{
		"German": "bright one, glorious"
		}
	],
	"notes": "The name Bertha is of Germanic origin, derived from the Old High
		German word 'beraht', meaning 'bright' or 'glorious'. It has been used since
		 the Middle Ages, with notable usage recorded in German-speaking regions.
		Bertha was popular among various European royal families, most famously
		Bertha of the Merovingians, a Frankish queen in the late 5th century.
		The name was especially popular in the 19th century in England and
		Germany, often associated with nobility."
	}
  }
]
```

# Direct DB Access via JS
Cut out the middleman and save! usBabyNames exposes the underlying sqliteDBs straight from the library.
``` js
const directDbAccess = async () => {
    const usBabyNamesModule = await import('../lib/usBabyNames.mjs');
    const nameDataDb = usBabyNamesModule.nameDataDb;
    const nameDetailsDb = usBabyNamesModule.nameDetailsDb;
    const nameDetailsSql = "SELECT * from usNameDetails where name = 'jonathan' and sex = 'm' ";
    nameDetailsDb.all(nameDetailsSql, [], (err, rows) => {
        if (err) {
            console.log('err', err);
            console.log (err);
        }
        console.log(rows);
    });

    const nameDataSql = "SELECT * from usNameData where name = 'jonathan' AND sex = 'm' ORDER BY year DESC limit 10";
    nameDataDb.all(nameDataSql, [], (err, rows) => {
        if (err) {
            console.log('err', err);
            console.log (err);
        }
        console.log(rows);
    });


};

directDbAccess();
```


# Example Application
<a href="https://github.com/jonroig/exampleUsBabyNamesVisualization.js">exampleUsBabyNamesVisualization.js</a>: a really basic example of usBabyNames.js, express.js, and Google charts.js.

# US Baby Names 1880-2023 Sqlite3 DB
Public domain.

Many people find the US Social Security Administration names files more useful in a sqlite database. For raw access to sql tables, just clone this repository and start querying.

I've done all the "hard" work of exporting all the historical United States birth name data from the original files (/raw_name_source) into a sqlite database. (It's not a hard thing to do, per se, it's just time consuming to load all the data... like over an hour running full speed ahead on a Macbook Pro with a SSD.) If you're curious how I did it, take a look at sqllite/loader.js. It ain't nothin' fancy. Presumably, it wouldn't be hard to modify it to load yob (year of birth) files into the database of your choice.

This database is 100% public domain and freely available for whatever purposes you like. Enjoy! Thanks SSA!

You can access the baby name sqlite database directly from the command line like so:
``` sql
# sqlite3 sqlite/us-name-data.sqlite

select * from usNameData WHERE name = 'jonathan' AND year = 1975 AND sex = 'm';

```

# Name Meanings / Pronunciation / Details DB
Public domain.

Generated by Chat GPT-4o-mini over the course of a few days in early August 2024, good enough to be useful and helpful, probably a little messsy behind the scenes. Any improvements are more than welcome -- especially if somebody wants to run a portion of name set through a fancier model. 

``` sql
# sqlite3 sqlite/us-name-details.sqlite 

select * from usNameDetails where name = 'bertha' AND sex = 'f';
```

# USA Historical Name Data Source: Government Fine Print
.. from the Original YOB Source Files:

National Data on the relative frequency of given names in the population of U.S. births where the individual has a Social Security Number

(Tabulated based on Social Security records as of March 6, 2016)

For each year of birth YYYY after 1879, we created a comma-delimited file called yobYYYY.txt. Each record in the individual annual files has the format "name,sex,number," where name is 2 to 15 characters, sex is M (male) or F (female) and "number" is the number of occurrences of the name. Each file is sorted first on sex and then on number of occurrences in descending order. When there is a tie on the number of occurrences, names are listed in alphabetical order. This sorting makes it easy to determine a name's rank. The first record for each sex has rank 1, the second record for each sex has rank 2, and so forth.

To safeguard privacy, we restrict our list of names to those with at least 5 occurrences.

# Why
Written over a weekend in early 2016, usBabyNames.js was created when Jon Roig (<a href="https://twitter.com/runnr_az">@runnr_az</a>) found existing baby name data websites / apps / etc... to be totally ridiculous. Since all of these other resources build off the same central resource, <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Administration baby names files</a>, and I was parsing the data anyway, I thought it'd be fun to learn how to package the whole thing up as an NPM module for anyone to use in the future.


[npm-image]: https://img.shields.io/npm/v/usbabynames.svg?style=flat-square
[npm-url]: https://npmjs.org/package/usbabynames
