const usBabyNames = await import('../lib/usBabyNames.mjs');

async function getByYearNameSex() {
	const theNames = await usBabyNames.get({name: 'jonathan', year: 1975, sex: 'm'});
	console.log(theNames);
  }
  
  getByYearNameSex();