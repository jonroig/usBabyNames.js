var babyNames = require('../usBabyNames.js');

var theNames = babyNames.getById(790921)
	.then(function(data){
		console.log('name=',data);
});