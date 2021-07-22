const usbabynames = require('../lib/usbabynames');

const getByBirthsRange = async () => {
	const theNames = await usbabynames.get({
		birthsRange: {start: 0, end: 10},
		year: 1975
	});
	console.log('theNames', theNames);
};

getByBirthsRange();