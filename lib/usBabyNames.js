/**
usBabyNames.js
... written by Jon Roig (@runnr_az) over a weekend in early 2016
**/

var sqlite3 = require('sqlite3').verbose();
var Promise = require('promise');
var path = require('path');

var db = new sqlite3.Database( path.resolve() + '/node_modules/usbabynames/sqlite/us-name-data.sqlite');

module.exports = {

	getByName: function(nameInput) {
		return this.get({name: nameInput});
	},


	getByYear: function(yearInput) {
		return this.get({year: yearInput});
	},


	getById: function(id) {
		return this.get({id: id});
	},


	get: function(params) {
		return new Promise(function (fulfill, reject) {
			var outputArray = [];
			var queryParams = [];

			db.serialize(function() {
				// the basic sql query

				if (params.unique) {
					var sql = 'SELECT DISTINCT name FROM usNameData WHERE "b" = "b" ';
				} else {
					var sql = 'SELECT * FROM usNameData WHERE "b" = "b" ';
				}

				// build the filters
				if (params.id) {
					sql += ' AND id = (?) ';
					queryParams.push (params.id );
				}
				if (params.name) {
					sql += ' AND name = (?) ';
					queryParams.push (params.name.toLowerCase() );
				}
				if (params.year) {
					sql += ' AND year = (?) ';
					queryParams.push (params.year );
				}
				if (params.yearRange) {
					sql += ' AND year >= (?) AND year <= (?) ';
					queryParams.push (params.yearRange.start );
					queryParams.push (params.yearRange.end );
				}
				if (params.sex) {
					sql += ' AND sex = (?) ';
					queryParams.push (params.sex.toUpperCase() );
				}
				if (params.rank) {
					sql += ' AND rank = (?) ';
					queryParams.push (params.rank );
				}
				if (params.rankRange) {
					sql += ' AND rank >= (?) AND rank <= (?) ';
					queryParams.push (params.rankRange.start );
					queryParams.push (params.rankRange.end );
				}
				if (params.births) {
					sql += ' AND births = (?) ';
					queryParams.push (params.births );
				}
				if (params.birthsRange) {
					sql += ' AND births >= (?) AND births <= (?) ';
					queryParams.push (params.birthsRange.start );
					queryParams.push (params.birthsRange.end );
				}
				if (params.unique) {
					sql += ' ORDER BY name';
				}

				// run the query, return the results...
				db.all(sql, queryParams, function(err, rows) {
					if (err) {
						reject (err);
					}

					fulfill(rows);
			  	});
			});
		});
	},


	getNameRankAndBirthsByYear: function(name, params) {
		return new Promise(function (fulfill, reject) {
			var outputObj = {};
			var queryParams = [];

			db.serialize(function() {
				// the basic sql query

				var sql = 'SELECT year, births, rank FROM usNameData WHERE name = (?) ';
				queryParams.push (name.toLowerCase() );

				if (params.sex) {
					sql += ' AND sex = (?) ';
					queryParams.push (params.sex.toUpperCase() );
				}

				// run the query, return the results...
				db.all(sql, queryParams, function(err, rows) {
					if (err) {
						reject (err);
					}

					// get into the array format we want...
					for (var index in rows) {
						var nameObj = rows[index];
						outputObj[nameObj.year] = {
							births: nameObj.births,
							rank: nameObj.rank
						}
					}

					if (params.getEmptyYears) {
						for (var x = 1880; x <= 2014; x++) {
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
