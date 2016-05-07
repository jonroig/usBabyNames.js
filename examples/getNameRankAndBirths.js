var babyNames = require('usbabynames');

var theNames = babyNames.getNameRankAndBirthsByYear('kanye', {sex: 'M', getEmptyYears: true})
	.then(function(data){
		console.log('data=',data);
});
