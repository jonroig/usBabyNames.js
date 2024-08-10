async function getByYear() {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theNames = await usBabyNames.getByYear(1975);
	console.log(theNames);
  }
  
  getByYear();