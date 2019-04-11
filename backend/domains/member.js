const fs = require("fs");
const {auth} = require('google-auth-library');
const keys = require('../google_keys.json');

class Member{
    async login() {
        return new Promise(
            async (resolve, reject) =>{
                const client = await auth.getClient({
                    scopes: "https://www.googleapis.com/auth/cloud-platform"
                });
                const projectId = await auth.getProjectId();
                console.log(projectId);
                const url = `https://www.googleapis.com/dns/v1/projects/${projectId}`;
                const res = await client.request({url});
                resolve(res.data);
                res.catch((error) => {
                    reject(error);
                });
            }
        )

    }
}

module.exports = {Member};