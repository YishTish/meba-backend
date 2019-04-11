"use strict";
const express = require("express");
const path = require("path");
const SwaggerExpress = require("swagger-express-mw");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
const request = require("request");

const config = require("./config");
const googleKeys = require("./google_keys.json");
const GoogleAuth = require("./security/googleAuth");
// const writer = require("./api/utils/writer");

// require("./db");

const app = express();
app.use(cors());


let swaggerConfigDir= path.join(__dirname,"api");
const swaggerConfig = {
    appRoot : __dirname,
    configDir: swaggerConfigDir,
    swaggerFile:path.join(swaggerConfigDir, "swagger.yaml")
};

const swaggerDocument = YAML.load(swaggerConfig.swaggerFile);

app.use("/login", (request, response, next)=>{
    const authentication_request = `https://accounts.google.com/o/oauth2/auth?client_id=${googleKeys.web.client_id}&redirect_uri=${config.redirect_uri}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code`;
    response.redirect(authentication_request);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/oauth2-redirect.html", (req, res, next)=>{
    res.sendFile("api/oauth2-redirect.html");
});
app.get("/auth", async (req, res, next) =>{
    const responseValues = res.req.query;
    const googleAuth = new GoogleAuth();
    try{
        const authObject = await googleAuth.getToken(responseValues.code);
        const payload = await googleAuth.verify(authObject.tokens.id_token);
        res.status(200).send({
            "first_name": payload.body.given_name,
            "last_name": payload.body.family_name,
            "picture": payload.body.picture,
            "token": authObject.tokens.id_token,
            "token_type": authObject.tokens.token_type
        });
    }
    catch(err){
        res.status(401).send({error: err.message});
    }
});

SwaggerExpress.create(swaggerConfig, async function(err, swaggerExpress) {
    if (err) {
        console.error(err);
        throw(err);
    }

    swaggerExpress.register(app);
    app.listen(config.urlPort);
    console.log(`Swagger gateway booted successfully on ${config.urlPath}:${config.urlPort}`);
});
