/**
basic loader for name files from the us census format of each entry
is name,sex,number rank is determined by order in the file

imports files from: https://www.ssa.gov/OACT/babynames/limits.html

run like: node national_loader.js

You'll need to DELETE the contents of us-name-data first
Also: this might take awhile to populate the sqlite file
	There's probably a more elegant way of doing this, but 🤷‍♀️ 
**/
import fs from 'fs';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('us-name-data.sqlite');
const thePath = '../raw_name_source';

const outputObject = {};

// grab the list of files from the source dir, parse through them
const theDir = fs.readdir(thePath, (err, fileNameArray) => {
	if (err) {
		console.log('err=',err);
		return;
	}

	for (let x = 0; x < fileNameArray.length; x++) {
		const theFileName = fileNameArray[x];

		// we only wanna parse the yob files
		if (theFileName.substr(0, 3) == 'yob') {
			const theYear = theFileName.replace('yob','').replace('.txt','');
			console.log('theYear=',theYear);

			const theRawYearData = fs.readFileSync(thePath + '/' + theFileName);
			const theRawYearDataArray = theRawYearData.toString().split('\r\n');

			const yearDataArray = [];
			const sexRank = {M: 0, F: 0}

			for (let i = 0; i < theRawYearDataArray.length; i++) {
				const theNameEntryArray = theRawYearDataArray[i].split(',');

				sexRank[theNameEntryArray[1]]++;

				const nameEntryOutputObj = {
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
	db.serialize(() => {
		let insertId = 0;
		
		for (let theYear in outputObject) {
			console.log('Year=',theYear);

			const theYearData = outputObject[theYear];
			console.log('Number of names=', theYearData.length);

			for (let x = 0; x < theYearData.length; x++) {
				const sql = `
					INSERT INTO usNameData 
					(id, name, sex, births, rank, year)
					VALUES (?, ?, ?, ?, ?, ?)`;
				const stmt = db.prepare(sql);
				
				insertId++;
				const theName = theYearData[x].name;
				const theSex = theYearData[x].sex;
				const theBirths = theYearData[x].births;
				const theRank = theYearData[x].rank;
				console.log(insertId, theName, theSex, theBirths, theRank, theYear);
				try {
					stmt.run(insertId, theName, theSex, theBirths, theRank, theYear);
					stmt.finalize();
				} catch (e) {
					console.log('error', e);
				}
			}
		}
	});

	db.close();
});
