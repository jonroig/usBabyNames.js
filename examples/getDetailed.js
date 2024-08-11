const getDetailed = async () => {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theMeaning = await usBabyNames.getDetailed('bertha', 'M');
	console.log('theMeaning', theMeaning);
  };
  
  getDetailed();