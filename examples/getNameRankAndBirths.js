async function getNameRankAndBirths() {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theNames = await usBabyNames.getNameRankAndBirthsByYear('kanye', {sex: 'm', getEmptyYears: true});
	console.log(theNames);
  }
  
  getNameRankAndBirths();