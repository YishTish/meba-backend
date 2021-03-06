const path = require("path");
const config = {
    urlPath: "http://localhost",
    urlPort: 3000,
    dbPath: "mongodb://localhost/meba",
    rootDir: __dirname
};
config.gatewayPath = config.urlPath+":"+config.urlPort+"/v1";
config.redirect_uri = `${config.urlPath}:${config.urlPort}/auth`;


module.exports = config;