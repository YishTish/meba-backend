const path = require("path");
const config = {
    urlPath: "http://localhost",
    urlPort: 5000,
    dbPath: "mongodb://localhost/meba-test",
    rootDir: path.join(__dirname, "../")
};
config.gatewayPath = config.urlPath+":"+config.urlPort+"/v1";

module.exports = config;