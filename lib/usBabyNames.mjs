/**
usBabyNames.js
... written by Jon Roig (@runnr_az) over a weekend in early 2016
	then kinda evolved from there
**/

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';

const startYear = 1880;
const endYear = 2023;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const nameDataDb = new sqlite3.Database( join(__dirname, '..', 'sqlite', 'us-name-data.sqlite'));
const nameDetailsDb = new sqlite3.Database( join(__dirname, '..', 'sqlite', 'us-name-details.sqlite'));
const stateNameDb = new sqlite3.Database( join(__dirname, '..', 'sqlite', 'state-name-data.sqlite'));

const emptyYearObj = {
	births: 0,
	rank: 0
};

const getAllByName = async (nameInput) => {
	const outputObj = {
		byYear: {}
	};

	// build an array of empty years
	for (let x = startYear; x <= endYear; x++) {
		outputObj.byYear[x] = {
			usa: {
				m: emptyYearObj,
				f: emptyYearObj
			},
		};
	};
	
	const stateNameObjs = await getStateNameData(nameInput);	
	const nationalNameObjs = await get({ name: nameInput});
	outputObj.detailM = await getDetailed(nameInput, 'm');
	outputObj.detailF = await getDetailed(nameInput, 'f');

	if (outputObj.detailM?.id) {
		delete outputObj.detailM.id;
		try {
			const decodedNameData = JSON.parse(outputObj.detailM.nameData);
			outputObj.detailM.nameData = decodedNameData;
		} catch (e) {
			const decodedNameData = {};
		}
	}

	if (outputObj.detailF?.id) {
		delete outputObj.detailF.id;
		try {
			const decodedNameData = JSON.parse(outputObj.detailF.nameData);
			outputObj.detailF.nameData = decodedNameData;
		} catch (e) {
			const decodedNameData = {};
		}
	}

	for (let index in nationalNameObjs) {
		const nameObj = nationalNameObjs[index];
		outputObj.byYear[nameObj.year]['usa'][nameObj.sex] = {
			births: nameObj.births,
			rank: nameObj.rank
		};
	}

	for (let index in stateNameObjs) {
		const nameObj = stateNameObjs[index];
		outputObj.byYear[nameObj.year][nameObj.state] = {
			m: emptyYearObj,
			f: emptyYearObj
		};
		
		outputObj.byYear[nameObj.year][nameObj.state][nameObj.sex] = {
			births: nameObj.births,
			rank: nameObj.rank
		};
	}
	return outputObj;
};



const getStateNameData = async (nameInput, sexInput = null) => {
	return new Promise((fulfill, reject) => {
		const outputArray = [];
		const queryParams = [nameInput];

		stateNameDb.serialize(() => {
			// the basic sql query
			let sql = 'SELECT * FROM stateNameData WHERE name = (?) ';
			if (sexInput) {
				sql += ' and sex = (?)';
				queryParams.push(sexInput);
			}
			stateNameDb.all(sql, queryParams, (err, rows) => {
				if (err) {
					console.log('err', err);
					reject (err);
				}
				
				fulfill(rows);
			});
		});
	});
};


const getDetailed = async (nameInput, sexInput) => {
	return new Promise((fulfill, reject) => {
		const sql = "SELECT * from usNameDetails where name = ? and sex = ?";
		// run the query, return the results...
		nameDetailsDb.all(sql, [nameInput, sexInput], (err, rows) => {
			if (err) {
				console.log('err', err);
				reject (err);
			}
			if (!rows.length) {
				return fulfill({});
			}
			return fulfill(rows[0]);
		});
	});
};


const getByName = async (nameInput) => {
	const output = await get({name: nameInput});
	return output;
};


const getByYear = async (yearInput) => {
	const output = await get({year: yearInput});
	return output;
};


const getById = async (id) => {
	const output = await get({id: id});
	return output[0] || {};
};


const get = async (params) => {
	return new Promise((fulfill, reject) => {
		const outputArray = [];
		const queryParams = [];

		nameDataDb.serialize(() => {
			// the basic sql query
			let sql = '';
			if (params?.unique) {
				sql = 'SELECT DISTINCT name FROM usNameData WHERE "b" = "b" ';
			} else {
				sql = 'SELECT * FROM usNameData WHERE "b" = "b" ';
			}

			// build the filters
			if (params?.id) {
				sql += ' AND id = (?) ';
				queryParams.push(params.id );
			}
			if (params?.name) {
				sql += ' AND name = (?) ';
				queryParams.push(params.name.toLowerCase() );
			}
			if (params?.year) {
				sql += ' AND year = (?) ';
				queryParams.push(params.year );
			}
			if (params?.yearRange) {
				sql += ' AND year >= (?) AND year <= (?) ';
				queryParams.push(params.yearRange.start );
				queryParams.push(params.yearRange.end );
			}
			if (params?.sex) {
				sql += ' AND sex = (?) ';
				queryParams.push(params.sex.toLowerCase() );
			}
			if (params?.rank) {
				sql += ' AND rank = (?) ';
				queryParams.push(params.rank );
			}
			if (params?.rankRange) {
				sql += ' AND rank >= (?) AND rank <= (?) ';
				queryParams.push(params.rankRange.start );
				queryParams.push(params.rankRange.end );
			}
			if (params?.births) {
				sql += ' AND births = (?) ';
				queryParams.push(params.births );
			}
			if (params?.birthsRange) {
				sql += ' AND births >= (?) AND births <= (?) ';
				queryParams.push(params.birthsRange.start );
				queryParams.push(params.birthsRange.end );
			}
			if (params?.unique) {
				sql += ' ORDER BY name';
			}

			// run the query, return the results...
			nameDataDb.all(sql, queryParams, (err, rows) => {
				if (err) {
					console.log('err', err);
					reject (err);
				}

				fulfill(rows);
			});
		});
	});
};


const getNameRankAndBirthsByYear = async (name, params) => {
	return new Promise((fulfill, reject) => {
		const outputObj = {};
		const queryParams = [];

		nameDataDb.serialize(() => {
			// the basic sql query

			let sql = 'SELECT year, births, rank, sex FROM usNameData WHERE name = (?)';
			queryParams.push(name?.toLowerCase() );

			if (params?.sex) {
				sql += ' AND sex = (?) ';
				queryParams.push(params?.sex.toLowerCase() );
			}

			// run the query, return the results...
			nameDataDb.all(sql, queryParams, (err, rows) => {
				if (err) {
					reject(err);
				}

				if (params?.getEmptyYears) {
					for (let x = startYear; x <= endYear; x++) {
						outputObj[x] = emptyYearObj;
					}
				}

				// get into the array format we want...
				for (let index in rows) {
					const nameObj = rows[index];
					outputObj[nameObj.year] = {
						births: nameObj.births,
						rank: nameObj.rank,
						sex: nameObj.sex
					};
				}
				fulfill(outputObj);
			});
		});
	});
};


export { 
	getByName,
	getByYear,
	getById,
	get,
	getNameRankAndBirthsByYear,
	getDetailed,
	getStateNameData,
	getAllByName,
	nameDataDb,
	nameDetailsDb,
	stateNameDb
 };
