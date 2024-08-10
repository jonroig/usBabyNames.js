const usBabyNames = require('../lib/usBabyNames');

const getByIdExample = async () => {
	const theName = await usBabyNames.getById(790921);
	console.log('theName', theName);
}

getByIdExample();