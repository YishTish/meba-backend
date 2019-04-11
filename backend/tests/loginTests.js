const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const request = require("request");
const axios = require('axios');


const config = require("../config");
const memberDomain = require("../domains/member");

chai.use(chaiAsPromised);
chai.should();

describe("Login tests", () => {
    it("Should return a 200 code when POSTing /member/login", (done) => {
        request.get(`${config.urlPath}:${config.urlPort}/login`,
            {headers: {"Content-Type": "text/plain"}}, (error, response, body) => {
        console.log(body);
        response.statusCode.should.equal(200);
        response.client._host.should.equal("accounts.google.com", "Login page should redirect from Google");
        done();
    });
});
});

describe("authenticationTest", () =>{
    it("Should reject calls to secured location without authenitcation header", async () =>{
        const response = await axios.get(`${config.gatewayPath}/member/23`)
             .catch((error)=>{
                 error.response.status.should.equal(403, "Request with no authorization header should return 403");
            });
        if(response){
           response.status.should.equal(403, "Request to unauthorized path should return 403 code");
        }
    });
    it("Should reject calls to secured location with a wrong authenitcation header", async () =>{
        const axiosInstance = axios.create();
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer 1234567890";
        const response = await axios.get(`${config.gatewayPath}/member/23`)
            .catch((error)=>{
                error.response.status.should.satisfy((x) => [401, 403].indexOf(x) > -1, "return error code 401 or 403");
            });
        if(response){
            response.status.should.satisfy((x) => [401, 403].indexOf(x) > -1, "return error code 401 or 403");
        }
    });
    it("Should pass call sent with the right authentication header", async () =>{
        const axiosInstance = axios.create();
        const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmNjc4MWJhNzExOTlhNjU4ZTc2MGFhNWFhOTNlNWZjM2RjNzUyYjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5MjcxNDE4MDA3NC1ianQ0amRkbzk2dmNyaWZhaWdxNTIxZWRvb2ZkMnJobi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjkyNzE0MTgwMDc0LWJqdDRqZGRvOTZ2Y3JpZmFpZ3E1MjFlZG9vZmQycmhuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0MDYxOTY4Mjk0OTI0NjA2NDc0IiwiYXRfaGFzaCI6IklMdmxJSG85V3o4czl6aXJ6VUFfX0EiLCJuYW1lIjoiWWlzaGFpIExhbmRhdSIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLU5HY3ZfWERtWnBJL0FBQUFBQUFBQUFJL0FBQUFBQUFBaG9NL0g0WFNfY0p4WDZVL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJZaXNoYWkiLCJmYW1pbHlfbmFtZSI6IkxhbmRhdSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTU0ODk5MjIzLCJleHAiOjE1NTQ5MDI4MjN9.oJOJtBndkqoj0ofqLM98iWUnrM-TwJw495c9AWfD3kXN3PWLOP-8hUeA3tbXGcP64FHzvUyT5X-CWUXZbgUQcGrNp8F9_UlCd701FjqsQWIf84msQos763M7LFrv407a56vR8BrdsfuGyyfq7JNYYNg0XAisvPtB7f8uaAH139kuux4wc0nQvSGpaLDTrGSqbfYyWRrOoV7qy1bcGyIOtsshBb4jdytLR4Jr_6GCzn9B20VGMUYH_TOjXBli_TrTr-yek6BEmheksOK6hEVN0aSVyvDTXwJqA6HvB8OgMnb0w746MG_TmHoNBm7pfEb3WCL5AZhh1BCwPipJDhVTQA";
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${config.gatewayPath}/member/23`)
            .catch((error)=>{
                console.log("Test failed");
            });
        if(response){
            response.status.should.equal(200);
        }
    });
});



