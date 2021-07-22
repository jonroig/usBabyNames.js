const usbabynames = require('../lib/usbabynames');

const getByYearNameSex = async () => {
	const theNames = await usbabynames.get({name: 'jonathan', year: 1975, sex: 'M'});
	console.log(theNames);
};

getByYearNameSex();