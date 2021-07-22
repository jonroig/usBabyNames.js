const usbabynames = require('../lib/usbabynames');

const getByYear = async () => {
	const theNames = await usbabynames.getByYear(1975);
	console.log(theNames);
};

getByYear();