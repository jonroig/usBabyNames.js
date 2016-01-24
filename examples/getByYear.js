var babyNames = require('../usBabyNames.js');

var theNames = babyNames.getByYear(1975)
	.then(function(data){
		console.log('names=',data);
});
