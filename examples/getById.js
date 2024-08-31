const { getById } = await import('../lib/usBabyNames.mjs');

const getByIdExample = async () => {
	const theName = await getById(790921);
	console.log('theName', theName);
  };
  
  getByIdExample();