import api from '@cocreate/api'
const CoCreateGoogleAuth = {
	id: 'googleauth',
	actions: [
		'generateAuthURL'
	],
	

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

export default CoCreateGoogleAuth;