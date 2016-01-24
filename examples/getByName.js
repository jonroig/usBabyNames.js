var babyNames = require('usbabynames');

var theNames = babyNames.getByName('jon')
	.then(function(data){
		console.log('names=',data);
});
