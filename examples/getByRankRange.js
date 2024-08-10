async function getByRankRange() {
	const usBabyNames = await import('../lib/usBabyNames.mjs');
	const theNames = await usBabyNames.get({rankRange: {start: 0, end: 10}});
	console.log(theNames);
  }
  
  getByRankRange();