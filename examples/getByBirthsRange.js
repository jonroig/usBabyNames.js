var babyNames = require('../usBabyNames.js');

var theNames = babyNames.get({
		birthsRange: {start: 0, end: 10},
		year: 1975
	})
	.then(function(data){
		console.log('names=',data);
});
