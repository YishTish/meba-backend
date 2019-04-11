const request = require("request");

const config = require("../config");
const googleKeys = require("../google_keys.json");
const GoogleAuth = require("./googleAuth");

module.exports = {
    // swagger-tools style handler
    oauth: async (req, authOrSecDef, scopesOrApiKey, next)  => {

        const googleAuth = new GoogleAuth();
        const authorizationHeader = req.header("Authorization");
        if (!authorizationHeader) {
            const error = new Error("Authorization header missing. Unauthorized");
            error.status = 401;
            next(error);
            // next({statusCode:401, body: "Error: Authorization header missing. Unauthorized"});
        } else {
            const authorizationCode = authorizationHeader.split(" ")[1];
            try {
                const verified = await googleAuth.verify(authorizationCode);
                next();
            } catch (error) {
                next(error);
            }
        }
        // const requestBody = {
        //         "code": authorizationCode,
        //         "client_id": googleKeys.web.client_id,
        //         "client_secret": googleKeys.web.client_secret,
        //         "redirect_uri": "http://localhost:3000/auth",
        //         "grant_type": "authorization_code"
        // };
        // request.post("https://accounts.google.com/o/oauth2/token", {
        //     body: requestBody,
        //     "json": true
        // }, (error, response, body) =>{
        //     if(error || response.statusCode !== 200){
        //         console.log(JSON.stringify(body));
        //         console.log(JSON.stringify(requestBody));
        //         next({code: error, statusCode: response.statusCode});
        // }
        // else{
        //     next();
        // }
        //
        // });
    }
};