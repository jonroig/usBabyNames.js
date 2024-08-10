const getMeaning = async () => {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theMeaning = await usBabyNames.getMeaning('bertha', 'F');
	console.log('theMeaning', theMeaning);
  };
  
  getMeaning();