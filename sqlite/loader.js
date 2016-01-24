// basic loader for name files from the us census
// format of each entry is name,sex,number
// rank is determined by order in the file

// uses name files from: https://www.ssa.gov/OACT/babynames/limits.html

// this might take awhile to populate the sqlite file

var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite/us-name-data.sqlite');
var thePath = './raw_name_source';

var outputObject = {};

// grab the list of files from the source dir, parse through them
var theDir = fs.readdir(thePath, function(err, fileNameArray){
	if (err) {
		console.log('err=',err);
		return;
	}

	for (var x = 0; x < fileNameArray.length; x++) {
		var theFileName = fileNameArray[x];

		// we only wanna parse the yob files
		if (theFileName.substr(0, 3) == 'yob') {
			var theYear = theFileName.replace('yob','').replace('.txt','');
			console.log('theYear=',theYear);

			var theRawYearData = fs.readFileSync(thePath + '/' + theFileName);
			var theRawYearDataArray = theRawYearData.toString().split('\r\n');

			var yearDataArray = [];
			var sexRank = {M: 0, F: 0}

			for (i = 0; i < theRawYearDataArray.length; i++) {
				var theNameEntryArray = theRawYearDataArray[i].split(',');

				sexRank[theNameEntryArray[1]]++;

				var nameEntryOutputObj = {
					name: theNameEntryArray[0].toLowerCase(),
					sex: theNameEntryArray[1],
					births: theNameEntryArray[2],
					rank: sexRank[theNameEntryArray[1]]
				}

				if (theNameEntryArray[0] != '') {
					yearDataArray.push(nameEntryOutputObj);
				}

			};

			outputObject[theYear] = yearDataArray;
		}
	}

	// at this point you have the complete outputObject...
	// you could do whatever you like with it...
	// we're just gonna clear the table and insert everything in...

	var insertId = 0;
	db.serialize(function() {
		db.run("DELETE FROM usNameData");

		for (var theYear in outputObject) {
			console.log('Year=',theYear);

			var theYearData = outputObject[theYear];
			console.log('Number of names=', theYearData.length);

			for (var x = 0; x < theYearData.length; x++) {
				insertId++;
				var theName = theYearData[x].name;
				var theSex = theYearData[x].sex;
				var theBirths = theYearData[x].births;
				var theRank = theYearData[x].rank;

				var sql = 'INSERT INTO usNameData ';
				sql += ' (id, name, sex, births, rank, year ) ';
				sql += ' VALUES ';
				sql += " (" + insertId + ", ";
				sql += " '" + theName + "', ";
				sql += " '" + theSex + "', ";
				sql += theBirths + ', ';
				sql += theRank + ', ';
				sql += theYear + ') ';

				db.run(sql);
			}
		}
	});

	db.close();

});


