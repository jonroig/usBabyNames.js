var babyNames = require('usbabynames');

var theNames = babyNames.getById(790921)
	.then(function(data){
		console.log('name=',data);
});