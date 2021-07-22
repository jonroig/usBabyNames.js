const usbabynames = require('../lib/usbabynames');

const getNameRankAndBirths = async () => {
	const theNames = await usbabynames.getNameRankAndBirthsByYear('kanye', {sex: 'M', getEmptyYears: true});
	console.log(theNames);
};

getNameRankAndBirths();
