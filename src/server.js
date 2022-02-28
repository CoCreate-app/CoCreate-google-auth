'use strict'
var utils= require('@cocreate/api');
var http = require('http');
var passport = require('passport');

const api = require("@cocreate/api");
const {OAuth2Client} = require('google-auth-library');
const open = require('open');
const url = require('url');
const destroyer = require('server-destroy');

class CoCreateGoogleAuth {
	constructor(wsManager) {
		this.name = 'googleauth';
		this.wsManager = wsManager;
		this.init();
		this.GOOGLE_CLIENT_ID=null;
		this.GOOGLE_CLIENT_SECRET=null;		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.name,(socket, data) => this.GoogleAuthOperations(socket, data));
		}
	}

	async GoogleAuthOperations(socket, data) {
    let that = this;
    let params = data['data'];
    let environment;
    let action = data['action'];
    
    try{
      let org = await api.getOrg(data, this.name);
      if (params.environment){
        environment = params['environment'];
        delete params['environment'];  
      } else {
        environment = org.apis[this.name].environment;
      }
      this.GOOGLE_CLIENT_ID = org.apis[this.name][environment].GOOGLE_CLIENT_ID;
      this.GOOGLE_CLIENT_SECRET = org.apis[this.name][environment].GOOGLE_CLIENT_SECRET;
    }catch(e){
      console.log(this.name+" : Error Connect to api",e)
      return false;
    }
    
    try {
      switch (action) {
        case 'generateAuthURL':
          const oAuth2Client = await this.getAuthenticatedClient(that, socket, action);
          const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
          const res = await oAuth2Client.request({url});
          this.wsManager.send(socket, this.name, { action, response })
          break;
      }
    } catch (error) {
      this.handleError(socket, action, error)
    }
  }
  

  handleError(socket, action, error) {
    const response = {
      'object': 'error',
      'data': error || error.response || error.response.data || error.response.body || error.message || error,
    };
    this.wsManager.send(socket, this.name, { action, response })
  }
        
	
	getAuthenticatedClient(that, socket, action) {
    return new Promise((resolve, reject) => {
      // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
      // which should be downloaded from the Google Developers Console.
      const port = 3004; // before 3000
      const oAuth2Client = new OAuth2Client(
        this.GOOGLE_CLIENT_ID,
        this.GOOGLE_CLIENT_SECRET,
        'http://server.cocreate.app:'+port+'/oauth2callback'
      );

      // Generate the url that will be used for the consent dialog.
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
      });

      // Open an http server to accept the oauth callback. In this simple example, the
      // only request to our webserver is to /oauth2callback?code=<code class="language-js">
      
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf('/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://server.cocreate.app:'+port).searchParams;
              const code = qs.get('code');
              console.log(`Code is ${code}`);
              res.end('Authentication successful! Please return to the console.');
              server.destroy();

              // Now that we have the code, use that to acquire tokens.
              const r = await oAuth2Client.getToken(code);
              // Make sure to set the credentials on the OAuth2 client.
              oAuth2Client.setCredentials(r.tokens);
              console.info('Tokens acquired.');
              resolve(oAuth2Client);
              
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(port, () => {
            this.wsManager.send(socket, this.name, { action, response:authorizeUrl })
            // // open the browser to the authorize url to start the workflow
          // open(authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
      destroyer(server);
    });
  }

	
}//end Class 
module.exports = CoCreateGoogleAuth;
