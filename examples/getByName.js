const usbabynames = require('../lib/usbabynames');

const getByName = async () => {
	const theNames = await usbabynames.getByName('jon');
	console.log('theNames', theNames);
};

getByName();


