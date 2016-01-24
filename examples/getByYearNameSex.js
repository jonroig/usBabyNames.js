var babyNames = require('usbabynames');

var theNames = babyNames.get({name: 'jonathan', year: 1975, sex: 'M'})
	.then(function(data){
		console.log('names=',data);
});
