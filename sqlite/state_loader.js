/**
basic loader for name files from the us census format of each entry
is name,sex,number rank is determined by order in the file

imports files from: https://www.ssa.gov/OACT/babynames/limits.html

run like: node state_loader.js

You'll need to DELETE the contents of state-name-data first
Also: this might take awhile to populate the sqlite file
	There's probably a more elegant way of doing this, but 🤷‍♀️ 
**/

import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('state-name-data.sqlite');
const thePath = '../state_raw_name_source';

const outputObject = {};

const insertNameData = (db, insertId, yearDataObj) => {
    console.log(insertId, yearDataObj);
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO stateNameData 
            (id, name, sex, births, rank, year, state)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        
        const theName = yearDataObj.name;
        const theYear = yearDataObj.year;
        const theSex = yearDataObj.sex;
        const theBirths = yearDataObj.births;
        const theRank = yearDataObj.rank;
        const theState = yearDataObj.state;
        try {
            stmt.run(insertId, theName, theSex, theBirths, theRank, theYear, theState);
            stmt.finalize(resolve);
        } catch (e) {
            console.log('error', e);
            reject(e);
        }
    });
}

// grab the list of files from the source dir, parse through them
const theDir = fs.readdir(thePath, (err, fileNameArray) => {
	if (err) {
		console.log('err=',err);
		return;
	}

	for (let x = 0; x < fileNameArray.length; x++) {
		const theFileName = fileNameArray[x];

		// we only wanna parse the yob files
        console.log('theFileName=',theFileName);
		if (theFileName !== 'StateReadMe.pdf') {
			const theState = theFileName.toLowerCase().replace('.txt','');
            
			console.log('theState=',theState);
			const theRawStateData = fs.readFileSync(thePath + '/' + theFileName);
			const theRawStateDataArray = theRawStateData.toString().split('\r\n');

			const stateDataArray = [];
			let sexRank = {M: 0, F: 0}
            let theYear = 0;
			for (let i = 0; i < theRawStateDataArray.length; i++) {
				const theNameEntryArray = theRawStateDataArray[i].split(',');
                if (theNameEntryArray.length > 1) {
                    if (theYear !== theNameEntryArray[2]) {
                        theYear = theNameEntryArray[2];
                        sexRank = {M: 0, F: 0};
                    }

                    sexRank[theNameEntryArray[1]]++;

                    // format = AK,F,1910,Mary,14
                    const nameEntryOutputObj = {
                        state: theNameEntryArray[0].toLowerCase(),
                        sex: theNameEntryArray[1].toLowerCase(),
                        year: theNameEntryArray[2],
                        name: theNameEntryArray[3].toLowerCase(),
                        births: theNameEntryArray[4],
                        rank: sexRank[theNameEntryArray[1]]
                    }

                    if (theNameEntryArray[0] != '') {
                        stateDataArray.push(nameEntryOutputObj);
                    }
                }
			};

			outputObject[theState] = stateDataArray;
		}
	}

    console.log(outputObject);

	db.serialize(async () => {
		let insertId = 0;
		
		for (let theState in outputObject) {
			const theYearData = outputObject[theState];

			for (let x = 0; x < theYearData.length; x++) {
                insertId++;
                const yearDataObj = theYearData[x];
                await insertNameData(db, insertId, yearDataObj);
			}
		}
	});
});
