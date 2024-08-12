const getDetailed = async () => {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theDetails = await usBabyNames.getDetailed('jonathan', 'M');
	console.log('theDetails', theDetails);
  };
  
  getDetailed();