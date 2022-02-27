import api from '@cocreate/api'
const CoCreateGoogleAuth = {
	name: 'googleauth',
	actions: {
		generateAuthURL: {
			response: function (data) {
				if (data.object == "error") {
					console.log(data.data);
				}
				location.href = data;
			},
		}
	}	
}

api.init({
	name: CoCreateGoogleAuth.name, 
	component:	CoCreateGoogleAuth,
});

export default CoCreateGoogleAuth;