async function getByYearNameSex() {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theNames = await usBabyNames.get({name: 'jonathan', year: 1975, sex: 'M'});
	console.log(theNames);
  }
  
  getByYearNameSex();