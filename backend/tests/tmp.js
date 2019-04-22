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

const controllerDirectory = path.join(config.rootDir, "api", "controllers");

const someFunc = ()=>{
    return new Promise(
        async (resolve) =>{
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
                    middleware.validateRequest(),
                    (request, response, next)=>{
                        console.log(request.swagger);
                        next();
                    },
                    RoutingMiddleware({controllerDirectory}),
                    // middleware.mock()
                    (request, response, next) =>{
                        if(response.statusCode !== 200){
                            const err = response.error || "Server error, please check logs";
                            throw new Error(err);
                        }
                    }
                );
                app.use("/", (request, response, next) =>{
                    response.status = 200;
                    response.send("Simple request returned successfully");
                });

                app.use((err, request, response, next) => {
                    const status = response.statusCode || 500;
                    response.status(status);
                    response.type("html");
                    response.send(util.format("<html><body><h1>%d Error</h1><p>%s</p></body></html>", status, err.message));
                    // reject({err});
                });

                app.listen(config.urlPort, () => {
                    console.log('MeBa backend application running on port ', config.urlPort);
                })
            });
        }
    )
};

// middleware.init(path.join(__dirname,'swagger.json'), (err) => {
//     app.use(
//         middleware.metadata(),
//         middleware.CORS(),
//         middleware.files(
//             {
//                 apiPath: 'api',
//                 rawFilesPath: false
//             }
//         ),
//         middleware.parseRequest(),
//         middleware.validateRequest(),
//         (request, response, next)=>{
//             console.log(request.swagger);
//             next();
//         },
//         RoutingMiddleware({controllerDirectory}),
//         // middleware.mock()
//         (request, response, next) =>{
//             if(response.statusCode !== 200){
//                 const err = response.error || "Server error, please check logs";
//                 throw new Error(err);
//             }
//         }
//     );
//     app.use("/", (request, response, next) =>{
//         response.status = 200;
//         response.send("Simple request returned successfully");
//     });
//
//     app.use((err, request, response, next) => {
//         const status = response.statusCode || 500;
//         response.status(status);
//         response.type("html");
//         response.send(util.format("<html><body><h1>%d Error</h1><p>%s</p></body></html>", status, err.message));
//         // reject({err});
//     });
//
//     app.listen(config.urlPort, () => {
//         console.log('MeBa backend application running on port ', config.urlPort);
//     })
// });
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
                    middleware.validateRequest(),
                    (request, response, next) =>{
                        if(response.statusCode !== 200){
                            const err = response.error || "Server error, please check logs";
                            throw new Error(err);
                        }
                        console.log(request.swagger);
                        next();
                    },
                    RoutingMiddleware(controllerOptions)
                    // middleware.mock()
                );
                app.use("/", (request, response, next) =>{
                    response.status = 200;
                    response.send("Simple request returned successfully");
                });

                app.use((err, request, response, next) => {
                    const status = response.statusCode || 500;
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
runServer({controllerDirectory: path.join(__dirname, "api", "controllers")})
    .then((res)=> console.log(res));