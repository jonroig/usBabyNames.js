# usBabyNames.js
Promise based data about US Baby Names born 1880-2014 for Node.js

# About
Built on <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Adminitration baby names files</a>, usBabyNames.js returns interesting historical data on baby name usage from 1880-2014. With 1,825,433 total entries packages withing a sqlite3 database, each record contains the following:
- Name
- Sex
- Number of births that year
- Rank for that year

This allows you to easily do the following:
- See the top 10 names for a year
- Track the popularity of a name over time
- Sort by male vs female name usage of a specific name
- See the number of children given the name "Jonathan" in 1975
- Calculate the percentage of childen named "Jonathan" since 1975
- Identify naming trends based on real data

# Usage
``` js
var babyNames = require('usBabyNames');

var theNames = babyNames.getByName('jon')
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
  birthsRange: {start: int, end: int}
}
```

# US Baby Names Sqlite3 Database
I've done all the "hard" work of exporting all the historical United States birth name data from the original files (/raw_name_source) into a sqlite database. 

If you're into that kind of thing, you can access the sqlite database directly if you like...
```
sqlite3 sqlite/us-name-data.sqlite

select * from usNameData WHERE name = 'jonathan' AND year = 1975 and sex = 'M';
```

# Why
Written over a weekend in early 2016, usBabyNames.js was created by Jon Roig (@runnr_az) found existing baby name data websites / apps... to be totally ridiculous. Since all of these other resources build off the same central resource, <a href="https://www.ssa.gov/OACT/babynames/limits.html">the Social Security Adminitration baby names files</a>, and I was parsing the data anyway, I thought it'd be fun to learn how to package the whole thing up as an NPM module for anyone to use in the future.

# To Do
Maybe add the state by state records?
