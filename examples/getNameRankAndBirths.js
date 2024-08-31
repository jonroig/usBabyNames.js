const usBabyNames = await import('../lib/usBabyNames.mjs');

async function getNameRankAndBirths() {
	const theNames = await usBabyNames.getNameRankAndBirthsByYear('kanye', {sex: 'm', getEmptyYears: true});
	console.log(theNames);
  }
  
  getNameRankAndBirths();