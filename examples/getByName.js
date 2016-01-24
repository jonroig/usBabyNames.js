var babyNames = require('../usBabyNames.js');

var theNames = babyNames.getByName('jon')
	.then(function(data){
		console.log('names=',data);
});
