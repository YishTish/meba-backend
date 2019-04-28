const path = require("path");
const express= require("express");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const axios = require('axios');
const util = require('util');
const swagger = require('swagger-express-middleware');
const Middleware = swagger.Middleware;
const RoutingMiddleware = require("../utils/swagger-routing-middleware");
const FormData = require("form-data");
const fs = require('fs');

chai.use(chaiAsPromised);
const should = chai.should();

const app = express();
const middleware = new Middleware(app);
const config = require("./config");

const runServer = async (controllerOptions, validationMiddleware) => {
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
                    // RoutingMiddleware(controllerOptions),
                    middleware.validateRequest(),
                   RoutingMiddleware(controllerOptions),
                    validationMiddleware
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

const launchServerAndSendRequest = (controllerOptions, requestOptions, validationMiddleware) => {
    return new Promise(
        async(resolve, reject) =>{
            if(validationMiddleware === undefined){
                validationMiddleware = function (request, response, next){
                        console.log("empty validation");
                        next();
                    }
                }
            try{
                const server = await runServer(controllerOptions, validationMiddleware);
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
    const controllerDirectory = path.join(__dirname, "api", "controllers");
    const contorllerOptions = {controllerDirectory};
    const swaggerPath = `${config.urlPath}:${config.urlPort}/v1`;
    const memberBody =  {
        "firstName": "test",
        "lastName": "test_last",
        "phoneNumber": "1234567",
        "phoneId": '1234567890'
    };
    it("should load server and return 200 on plain existing request", async () => {
        const requestOptions = {
            method: "get",
            url:`${swaggerPath}/members`
        };
        const response = await launchServerAndSendRequest(contorllerOptions,requestOptions)
            .catch((error) => console.log(error));
        response.status.should.equal(200, "sent valid request for swagger controllers, did not get 200");
    });
    it("should return 400 when no controllerDirectory is sent", async () => {
        const requestOptions = {
            method: "get",
            url:`${swaggerPath}/members`,
        };
        const response = await launchServerAndSendRequest({},requestOptions);
        console.log(response.body);
        response.status.should.equal(400, "sent no swagger controller parameters, expecting to receive status 400");
    });
    it("should return 400 when wrong controllerDirectory is sent", async () => {
        const response = await launchServerAndSendRequest(
            {controllerDirectory: path.join("aai", "controllers")},
            {method: "get",url:`${swaggerPath}/members`});
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
            {method: "get", url:`${swaggerPath}/zzz`});
        response.status.should.equal(404, "sent to a swagger path that does not exist. Expecting 404");
    });
    it("Should convert parameters sent via path into the right swagger parameters", async() => {
        const validationMiddleware = (request, response, next) => {
            try{
                should.exist(request.swagger, "request should have a full swagger object");
                    request.swagger.should.have.property("params");
                    should.exist(request.swagger.params['memberId'], "memberId was sent as path paramter. Should exist");
                    request.swagger.params['memberId'].value.should.equal("12345", "memberId 12345 was sent. Expecting to see it in request swagger object");
                    request.swagger.params['api-token'].value.should.equal('123456', "api-token was sent as header, should be received as param value");
                    next();
            }
            catch(error){
                console.log(error);
                throw(error);
            }
        };
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "put", url: `${swaggerPath}/member/12345`, headers: {'api-token': '123456'}},
            validationMiddleware
        )
            .catch((error) =>{
                console.log(error);
            });
        response.status.should.equal(200, "path validation should be successful and return 200");
    });

    it("Should convert parameters sent via query into the right swagger parameters", async() => {
        const validationMiddleware = (request, response, next) => {
            try{
                should.exist(request.swagger, "request should have a full swagger object");
                request.swagger.should.have.property("params");
                should.exist(request.swagger.params['activeOnly'], "activeOnly was sent as query paramter. Should exist");
                request.swagger.params['activeOnly'].value.should.equal(true, "variable 'activeOnly' should be true");
                next();
            }
            catch(error){
                console.log(error);
                throw(error);
            }
        };
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "get", url: `${swaggerPath}/members?activeOnly=true`, headers: {'api-token': '123456'}},
            validationMiddleware
        )
            .catch((error) =>{
                console.log(error);
            });
        response.status.should.equal(200, "query validation should be successful and return 200");
    });

    it("Should convert parameters sent via body into the right swagger parameters", async() => {
        const validationMiddleware = (request, response, next) => {
            try{
                request.swagger.params['member'].value.firstName.should.equal(memberBody.firstName, "variable 'firstName' should be "+memberBody.firstName);
                request.swagger.params['member'].value.lastName.should.equal(memberBody.lastName, "variable 'lastName' should be "+memberBody.lastName);
                console.log("validated request body");
                next();
            }
            catch(error){
                console.log(error);
                throw(error);
            }
        };
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "post", url: `${swaggerPath}/member`, headers: {'api-token': '123456'}, data: memberBody},
            validationMiddleware
        )
            .catch((error) =>{
                console.log(error);
            });
        response.status.should.equal(200, "query validation should be successful and return 200");
    });

    it("Should convert parameters sent via formData into the right swagger parameters", async() => {
        const photoDescription = "this is the file description"
        const validationMiddleware = (request, response, next) => {
            try{
                request.swagger.params['description'].value.should.equal(photoDescription, "variable 'description' should be "+photoDescription);
                should.exist(request.swagger.params['photo'].value, "Photo file should be sent");
                console.log("validated request body");
                next();
            }
            catch(error){
                console.log(error);
                throw(error);
            }
        };
        const form = new FormData();
        form.append('description', photoDescription);
        form.append('photo', fs.createReadStream(path.join(__dirname, "testFile.txt")));
        const response = await launchServerAndSendRequest(
            contorllerOptions,
            {method: "post", url: `${swaggerPath}/member/12345/uploadPhoto`, headers: form.getHeaders(), data: form},
            validationMiddleware
        )
            .catch((error) =>{
                console.log(error);
            });
        response.status.should.equal(200, "query validation should be successful and return 200");
    });

});