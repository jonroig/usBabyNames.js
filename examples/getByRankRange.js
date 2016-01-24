var babyNames = require('../usBabyNames.js');

var theNames = babyNames.get({rankRange: {start: 0, end: 10}})
	.then(function(data){
		console.log('names=',data);
});
