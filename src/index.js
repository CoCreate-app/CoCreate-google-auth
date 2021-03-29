
const CoCreateGoogleAuth = {
	id: 'googleauth',
	actions: [
		'generateAuthURL'
	],
	
	action_generateAuthURL: function(element, data) {
	    console.log('action generateAuthURL');
		CoCreate.api.send('googleauth', 'generateAuthURL', {});
	},
	
	render_generateAuthURL: function (data) {
        if (data.object == "error") {
        	console.log(data.data);
        }
        location.href = data;
    },
	
}

api.init({
	name: CoCreateGoogleAuth.id, 
	module:	CoCreateGoogleAuth,
});