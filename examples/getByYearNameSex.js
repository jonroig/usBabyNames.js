var babyNames = require('../usBabyNames.js');

var theNames = babyNames.get({name: 'jonathan', year: 1975, sex: 'M'})
	.then(function(data){
		console.log('names=',data);
});
