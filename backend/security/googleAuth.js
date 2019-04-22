const axios = require("axios");
const googleKeys = require("./google_keys.json");
const {OAuth2Client} = require("google-auth-library");


class GoogleAuth {
    constructor(){
        this.client = new OAuth2Client(googleKeys.web.client_id,
            googleKeys.web.client_secret,
            googleKeys.web.redirect_uris[1]);
    }

    async verify(token){
        return new Promise(
            async (resolve, reject) =>{
                try{
                    const ticket = await this.client.verifyIdToken({
                        idToken: token,
                        audience: googleKeys.web.client_id
                    });
                    const payload = ticket.getPayload();
                    console.log(payload);
                    if(payload.aud !== googleKeys.web.client_id){
                        reject({error: "Token contains wrong client_id (sub). Unauthorized"});
                    }
                    resolve({body: payload});
                }
                catch(error){
                    reject(error);
                }
            }
        )

    }

    async getToken(authenticationCode){
        return new Promise(
            async (resolve, reject) =>{
                try{
                    const token = await this.client.getToken(authenticationCode);
                    this.client.setCredentials(token.tokens);
                    //resolve(this.client.getTokenInfo(this.client.credentials.access_token));
                    resolve(token);
                }
                catch(error){
                    console.log("Failed to get token: ", error);
                    reject(error);
                }
            }
        );

    }
}

module.exports = GoogleAuth;