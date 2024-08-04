/**
usBabyNames.js
... written by Jon Roig (@runnr_az) over a weekend in early 2016
**/
var sqlite3 = require('sqlite3').verbose();
var path = require('path');

var db = new sqlite3.Database( path.join(__dirname, '..', 'sqlite', 'us-name-data.sqlite'));

const usBabyNames = {

	getByName: async (nameInput) => {
		const output = await usBabyNames.get({name: nameInput});
		return output;
	},


	getByYear: async (yearInput) => {
		const output = await usBabyNames.get({year: yearInput});
		return output;
	},


	getById: async (id) => {
		const output = await usBabyNames.get({id: id});
		return output[0] || {};
	},


	get: async (params) => {
		return new Promise((fulfill, reject) => {
			const outputArray = [];
			const queryParams = [];

			db.serialize(() => {
				// the basic sql query
				let sql = '';
				if (params.unique) {
					sql = 'SELECT DISTINCT name FROM usNameData WHERE "b" = "b" ';
				} else {
					sql = 'SELECT * FROM usNameData WHERE "b" = "b" ';
				}

				// build the filters
				if (params.id) {
					sql += ' AND id = (?) ';
					queryParams.push(params.id );
				}
				if (params.name) {
					sql += ' AND name = (?) ';
					queryParams.push(params.name.toLowerCase() );
				}
				if (params.year) {
					sql += ' AND year = (?) ';
					queryParams.push(params.year );
				}
				if (params.yearRange) {
					sql += ' AND year >= (?) AND year <= (?) ';
					queryParams.push(params.yearRange.start );
					queryParams.push(params.yearRange.end );
				}
				if (params.sex) {
					sql += ' AND sex = (?) ';
					queryParams.push(params.sex.toUpperCase() );
				}
				if (params.rank) {
					sql += ' AND rank = (?) ';
					queryParams.push(params.rank );
				}
				if (params.rankRange) {
					sql += ' AND rank >= (?) AND rank <= (?) ';
					queryParams.push(params.rankRange.start );
					queryParams.push(params.rankRange.end );
				}
				if (params.births) {
					sql += ' AND births = (?) ';
					queryParams.push(params.births );
				}
				if (params.birthsRange) {
					sql += ' AND births >= (?) AND births <= (?) ';
					queryParams.push(params.birthsRange.start );
					queryParams.push(params.birthsRange.end );
				}
				if (params.unique) {
					sql += ' ORDER BY name';
				}

				// run the query, return the results...
				db.all(sql, queryParams, (err, rows) => {
					if (err) {
						console.log('err', err);
						reject (err);
					}

					fulfill(rows);
			  	});
			});
		});
	},


	getNameRankAndBirthsByYear: async (name, params) => {
		return new Promise((fulfill, reject) => {
			const outputObj = {};
			const queryParams = [];

			db.serialize(() => {
				// the basic sql query

				let sql = 'SELECT year, births, rank FROM usNameData WHERE name = (?)';
				queryParams.push(name.toLowerCase() );

				if (params.sex) {
					sql += ' AND sex = (?) ';
					queryParams.push(params.sex.toUpperCase() );
				}

				// run the query, return the results...
				db.all(sql, queryParams, (err, rows) => {
					if (err) {
						reject (err);
					}

					// get into the array format we want...
					for (let index in rows) {
						const nameObj = rows[index];
						outputObj[nameObj.year] = {
							births: nameObj.births,
							rank: nameObj.rank
						};
					}

					if (params.getEmptyYears) {
						for (let x = 1880; x <= 2020; x++) {
							if (!outputObj[x]) {
								outputObj[x] = {
									births: 0,
									rank: 0
								}
							}
						}
					}

					fulfill(outputObj);
			  	});
			});
		});
	}
}

module.exports = usBabyNames;