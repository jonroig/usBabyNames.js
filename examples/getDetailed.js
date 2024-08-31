const usBabyNames = await import('../lib/usBabyNames.mjs');

const getDetailed = async () => {
	const theDetails = await usBabyNames.getDetailed('jonathan', 'm');
	console.log('theDetails', theDetails);
  };
  
  getDetailed();