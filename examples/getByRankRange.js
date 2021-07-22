const usbabynames = require('../lib/usbabynames');

const getByRankRange = async () => {
	const theNames = await usbabynames.get({rankRange: {start: 0, end: 10}});
	console.log(theNames);
};

getByRankRange();