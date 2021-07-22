const usbabynames = require('../lib/usbabynames');

const getByIdExample = async () => {
	const theName = await usbabynames.getById(790921);
	console.log('theName', theName);
}

getByIdExample();