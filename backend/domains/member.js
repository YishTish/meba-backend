const fs = require("fs");
const {auth} = require('google-auth-library');
const mongoose = require("mongoose");
const keys = require('../google_keys.json');
const schemas = require("../schemas");

class Member{

    constructor() {
        this.model = mongoose.model("member", schemas.member);
    };

    memberData(member){
        const memberObject = {};
        ["firstName", "lastName", "phoneNumber"].forEach(
            (key) => memberObject[key] = member.get(key)
            );
        return memberObject;
    }

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
    create(memberObject) {
        return new Promise(
            async (resolve, reject) =>{
                try{
                    const newMember = await this.model.create(memberObject);
                    newMember.save();
                    resolve(this.memberData(newMember));
                }
                catch(error){
                    console.log("Failed to creare new member", error);
                    reject(error);
                }
            }
        );
    }
    delete(memberId) {
        return new Promise(
            async(resolve, reject) =>{
                this.model.delete({"email": memberId})
            }
        )
    }
}

module.exports = new Member();