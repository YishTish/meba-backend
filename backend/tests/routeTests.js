const path = require("path");
const express= require("express");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const axios = require('axios');
const util = require('util');
const swagger = require('swagger-express-middleware');
const Middleware = swagger.Middleware;
const RoutingMiddleware = require("../utils/swagger-routing-middleware");


chai.use(chaiAsPromised);
chai.should();

const app = express();
const middleware = new Middleware(app);
const config = require("./config");

const runServer = async (controllerOptions) => {
    return new Promise(
        (resolve, reject) => {
            middleware.init(path.join(__dirname,'swagger.json'), (err) => {
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
                    RoutingMiddleware(controllerOptions),
                    middleware.validateRequest(),
                    // middleware.mock()
                    // (request, response, next) =>{
                    //     if(response.statusCode !== 200){
                    //         const err = response.error || "Server error, please check logs";
                    //         throw new Error(err);
                    //     }
                    // }
                );
                app.use("/", (request, response, next) =>{
                   response.status = 200;
                   response.send("Simple request returned successfully");
                });

                app.use((err, request, response, next) => {
                    const status = err.status || 500;
                    response.status(status);
                    response.type("html");
                    response.send(util.format("<html><body><h1>%d Error</h1><p>%s</p></body></html>", status, err.message));
                   // reject({err});
                });

                const server = app.listen(config.urlPort, () => {
                    console.log('MeBa backend application running on port ', config.urlPort);
                    resolve(server);
                })
            });
        }
    )
};

const launchServerAndSendRequest = (controllerOptions, requestOptions) => {
    return new Promise(
        async(resolve, reject) =>{
            try{
                const server = await runServer(controllerOptions);
                const response = await axios(requestOptions)
                    .catch((error) => {
                        if(error.response && error.response !== undefined){
                            resolve(error.response);
                        }
                        else{
                            console.log(error);
                            throw error;
                        }
                    });
                    server.close(() => console.log("Server closed"));
                    resolve(response);

            }
            catch(error){
                console.log(error);
                reject(error);
            }
        }
    );

};

describe("server should load and run tests", () => {
    const controllerDirectory = path.join(config.rootDir, "api", "controllers");
    const contorllerOptions = {controllerDirectory};
    const swaggerPath = `${config.urlPath}:${config.urlPort}/v1/member`;
    const memberBody =  {
        "firstName": "test",
        "lastName": "test_last",
        "phoneNumber": "1234567"
    };
    it("should load server and return 200 on plain existing request", async () => {
        const requestOptions = {
            method: "get",
            url:swaggerPath
        };
        const response = await launchServerAndSendRequest(contorllerOptions,requestOptions)
            .catch((error) => console.log(error));
        response.status.should.equal(200, "sent valid request for swagger controllers, did not get 200");
    });
    it("should return 400 when no controllerDirectory is sent", async () => {
        const requestOptions = {
            method: "get",
            url:swaggerPath,
        };
        const response = await launchServerAndSendRequest({},requestOptions);
        console.log(response.body);
        response.status.should.equal(400, "sent no swagger controller parameters, expecting to receive status 400");
    });
    it("should return 400 when wrong controllerDirectory is sent", async () => {
        const response = await launchServerAndSendRequest(
            {controllerDirectory: path.join("aai", "controllers")},
            {method: "get",url:swaggerPath});
        response.status.should.equal(400, "sent wrong swagger controller parameters, expecting to receive status 400");
    });
    it("should pass the request on (move to next) when not a swagger path (/v1)", async() =>{
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "get", url:`${config.urlPath}:${config.urlPort}/`});
        response.status.should.equal(200, "sent a request to a path that is not swagger related. middleware should be ignored");
    });
    it("should return a 404 when passing a swagger path that doesnt exist", async() =>{
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "get", url:`${swaggerPath}zzz`});
        response.status.should.equal(404, "sent to a swagger path that does not exist. Expecting 404");
    });
    it("Should convert parameters sent via body, path, and request into the right swagger parameters", async() =>{

    });
    it("should pass the request on to the controller to perform expected request", async() =>{

    });
});