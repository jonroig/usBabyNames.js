const usBabyNames = await import('../lib/usBabyNames.mjs');

async function getByRankRange() {
	const theNames = await usBabyNames.get({rankRange: {start: 0, end: 10}});
	console.log(theNames);
  }
  
  getByRankRange();