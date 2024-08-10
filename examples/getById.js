const getByIdExample = async () => {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theName = await usBabyNames.getById(790921);
	console.log('theName', theName);
  };
  