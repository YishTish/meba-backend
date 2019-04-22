"use strict";
const util = require('util');
const express = require("express");
const path = require("path");
const swagger = require('swagger-express-middleware');
const Middleware = swagger.Middleware;
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");


const RoutingMiddleware = require("./utils/swagger-routing-middleware");
const config = require("./config");
const googleKeys = require("./google_keys.json");
const GoogleAuth = require("./security/googleAuth");
const db = require("./db");
// const writer = require("./api/utils/writer");

const app = express();
const middleware = new Middleware(app);
// app.use(cors());

let swaggerConfigDir= path.join(config.rootDir,"api");
const swaggerDocument = YAML.load(path.join(swaggerConfigDir, "swagger.yaml"));

const setupBasicRouting = (app) =>{

    app.get('/favicon.ico', (req, res, next) =>{
        res.sendFile(path.join(config.rootDir,"favicon.ico"));
    });

    // app.use("/docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

    app.use("/login", (request, response)=>{
        const authentication_request = `https://accounts.google.com/o/oauth2/auth?client_id=${googleKeys.web.client_id}&redirect_uri=${config.redirect_uri}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code`;
        response.redirect(authentication_request);
    });
    app.use("/oauth2-redirect.html", (req, res)=>{
        res.sendFile("api/oauth2-redirect.html");
    });
    app.get("/auth", async (req, res) =>{
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
};


middleware.init('./api/swagger.yaml', (err) =>{
    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(
            {
                apiPath: 'api',
                rawFilesPath: false
            }
        ),
        middleware.parseRequest(),
        middleware.validateRequest(),
        RoutingMiddleware({controllerDirectory: path.join(config.rootDir, "api", "controllers")}),
        // middleware.mock()
    );

    app.use((err, request, response, next) =>{
        const status = err.status || 500;
        response.status(status);
        response.type("html");
        response.send(util.format("<html><body><h1>%d Error</h1><p>%s</p></body></html>", status, err.message));
    });
    setupBasicRouting(app);

    app.listen(config.urlPort, () =>{
        console.log('MeBa backend application running on port ', config.urlPort);
        db.connect(config.dbPath);
    })
});


// const swaggerConfig = {
//     appRoot : __dirname,
//     configDir: swaggerConfigDir,
//     swaggerFile:path.join(swaggerConfigDir, "swagger.yaml")
// };
//
// const swaggerDocument = YAML.load(swaggerConfig.swaggerFile);
//
// app.use("/login", (request, response, next)=>{
//     const authentication_request = `https://accounts.google.com/o/oauth2/auth?client_id=${googleKeys.web.client_id}&redirect_uri=${config.redirect_uri}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code`;
//     response.redirect(authentication_request);
// });
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/oauth2-redirect.html", (req, res, next)=>{
//     res.sendFile("api/oauth2-redirect.html");
// });
// app.get("/auth", async (req, res, next) =>{
//     const responseValues = res.req.query;
//     const googleAuth = new GoogleAuth();
//     try{
//         const authObject = await googleAuth.getToken(responseValues.code);
//         const payload = await googleAuth.verify(authObject.tokens.id_token);
//         res.status(200).send({
//             "first_name": payload.body.given_name,
//             "last_name": payload.body.family_name,
//             "picture": payload.body.picture,
//             "token": authObject.tokens.id_token,
//             "token_type": authObject.tokens.token_type
//         });
//     }
//     catch(err){
//         res.status(401).send({error: err.message});
//     }
// });
//
// SwaggerExpress.create(swaggerConfig, async function(err, swaggerExpress) {
//     if (err) {
//         console.error(err);
//         throw(err);
//     }
//
//     swaggerExpress.register(app);
//     app.listen(config.urlPort);
//     console.log(`Swagger gateway booted successfully on ${config.urlPath}:${config.urlPort}`);
// });
