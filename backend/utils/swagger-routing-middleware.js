const _ = require("lodash");
const path = require("path");
const fs = require('fs');

module.exports = function (options) {
    return (request, response, next) => {
        try{
            const controllerDirectory = options.controllerDirectory;
            if(!controllerDirectory){
                throw new Error("Controller Directory not sent");
            }
            if(!fs.existsSync(controllerDirectory)){
                throw new Error("Controller directory is not a valid existing path");
            }
            if(!request.swagger.operation || request.swagger.operation === undefined || request.swagger.operation === null){
                next();
            }
           else{
                const controllerOperation = request.swagger.operation.operationId;
                request.swagger.params.forEach((param) =>{
                    switch(param.in){
                        case 'path':
                            param.value = request.pathParams[param.name];
                            break;
                        case 'body':
                            param.value = request.body;
                            break;
                        case 'query':
                            param.value = request.query[param.name];
                        case 'header':
                            param.value = request.headers[param.name];
                        case 'formData':
                            if(param.type === "string"){
                                param.value = request.body[param.name];
                            }
                            else if(param.type === "file"){
                                param.value = request.files[param.name];
                            }
                    }
                });
                const swaggerParams = {};
                request.swagger.params.forEach((param) => swaggerParams[param['name']] = param);
                request.swagger.params = swaggerParams;
                const controllerToLoad = _.camelCase(request.swagger.operation.tags[0]);
                const controller = require(path.join(controllerDirectory, _.upperFirst(controllerToLoad)));
                controller[controllerOperation](request, response, next);
            }

        }
        catch(error){
            console.log("error in request: ", request.path, error);
            response.statusCode = 400;
            error.status = 400;
            response.error = error;
            // throw new Error("broke");
            next();
            // return;
        }
    }
};
