import api from '@cocreate/api'
const CoCreateGoogleAuth = {
	name: 'googleauth',
	endPoints: {
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

api.init(CoCreateGoogleAuth);

export default CoCreateGoogleAuth;