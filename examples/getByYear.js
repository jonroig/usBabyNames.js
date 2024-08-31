const usBabyNames = await import('../lib/usBabyNames.mjs');

async function getByYear() {
	const theNames = await usBabyNames.getByYear(1975);
	console.log(theNames);
  }
  
  getByYear();