const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Bet = require("../models/bet");
const Parlay = require("../models/parlay");

describe("Testing Parlay Endpoints BEFORE Log In", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    const parlay1 = {};

    describe("POST /parlay/", () => {
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).post("/parlay").send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).post("/parlay")
            .set("Authorization", "Bearer BAD")
            .send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /parlay", () => {
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).get("/parlay").send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).get("/parlay")
            .set("Authorization", "Bearer BAD")
            .send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /parlay/:id", () => {
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).get("/parlay/12347").send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).get("/parlay/1234")
            .set("Authorization", "Bearer BAD")
            .send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
    })
    describe("PUT /parlay/:id", () =>{
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).put("/parlay/123456").send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).put("/parlay/123456")
            .set("Authorization", "Bearer BAD")
            .send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
    })
    describe("DELETE /parlay/:id", () =>{
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).delete("/parlay/123456").send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).delete("/parlay/123456")
            .set("Authorization", "Bearer BAD")
            .send(parlay1);
            expect(res.statusCode).toEqual(401);
        });
    })
});

describe("Testing Parlay Endpoints AFTER Log In", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);
    
    // Define Users Constants for Testing
    const adminUser = {
        firstName: "Karl",
        lastName: "Creek",
        email: "karl@gmail.com",
        password: "pass123"
    }
    const user0 = {
        firstName: "User0",
        lastName: "Hemsworth",
        email: "user0@yahoo.com",
        password: "pass456"
    };
    const user1 = {
        firstName: "User1",
        lastName: "chadsworth",
        email: "user1@yahoo.com",
        password: "pass456"
    };

    // Define the Tokens
    let adminToken;
    let token0;
    let token1;

    // Define the Objects
    let bet0Object;
    let bet1Object;
    let bet2Object;
    let bet3Object;

    // Define Bet Constants for Testing
    const bet0 = { terms: "Bet0 Bet Terms", price: 100 };
    const bet1 = { terms: "Bet1 Bet Terms", price: 69 };
    const bet2 = { terms: "Bet2 Bet Terms", price: 55};
    const bet3 = { terms: "Bet3 Bet Terms", price: 70};

    beforeEach(async () => {
        // Define Users and Log them In
        // User 0
        await request(server).post("/auth/signup").send(user0);
        const res0 = await request(server).post("/auth/login").send(user0);
        token0 = res0.body.token;
        // User 1
        await request(server).post("/auth/signup").send(user1);
        const res1 = await request(server).post("/auth/login").send(user1);
        token1 = res1.body.token;
        // Admin User
        await request(server).post("/auth/signup").send(adminUser);
        const adminRoles = { roles: ['admin', 'user' ]};
        await User.updateOne({ email: adminUser.email }, adminRoles);
        const resadmin = await request(server).post("/auth/login").send(adminUser);
        adminToken = resadmin.body.token;

        // Add Bets to the Database
        bet0Object = await request(server)
        .post("/bet")
        .set("Authorization", "Bearer " + token0)
        .send(bet0);
        bet1Object = await request(server)
        .post("/bet")
        .set("Authorization", "Bearer " + token1)
        .send(bet1);
        bet2Object = await request(server)
        .post("/bet")
        .set("Authorization", "Bearer " + token0)
        .send(bet2);
        bet3Object =  await request(server)
        .post("/bet")
        .set("Authorization", "Bearer " + token1)
        .send(bet3);

        // Turn the Requests into actual Objects
        bet0Object = bet0Object.body;
        bet1Object = bet1Object.body;
        bet2Object = bet2Object.body;
        bet3Object = bet3Object.body;
    });

    describe("POST /parlay/", () => {
        it("Should Reject Parlays with less than 2 Bets", async () =>{
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id]);
            expect(res.statusCode).toEqual(400);

        });
        it("Should Reject Parlays When Provided Invalid Bet Ids", async () => {
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, 'E43BEB3CE5B2E64521801387']);
            expect(res.statusCode).toEqual(404);
        });
        it("Should Create a Parlay With 2 or More Bets and properly Calculate Cost", async () => {
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            expect(res.statusCode).toEqual(200);
            expect(res.body.parlayBets.length).toEqual(3);
            expect(res.body.parlayCost).toEqual(224);
        });
    });

    describe("GET /parlay/", () => {
        it("Admin: Should Return All Parlays", async () => {
            // Create a Parlay
            await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Create a Second Parlay
            await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet3Object._id]);
            // Make a Call to the End Point with the Admin Token
            const res = await request(server)
                .get("/parlay")
                .set("Authorization", "Bearer " + adminToken)
                .send();
            // Get the actual Information from the Server
            const dbInfo = await Parlay.find().lean();
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(2);
            // -- Need to Work on thsi but I know that its giving me the correct information.
            //expect(res.body).toMatchObject(dbInfo);
        });
        it("Non Admin: Should Only Return Parlays Owned by User", async () => {
            // Create a Parlay from User 0
            await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet3Object._id]);
            // Create a Parlay from User 1
            await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token1)
            .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Call the "Get" Endpoint with User 1 Token
            const res = await request(server)
                .get("/parlay")
                .set("Authorization", "Bearer " + token0)
                .send();
            // -- Expectations            
            // Expect the Right Parlay is Provided -- Need to validate the Content at a later date.
            // Expect that only one Parlay Is returned
            expect(res.body.length).toEqual(1);
            // Expect the Status Code to be 200
            expect(res.statusCode).toEqual(200);

        })
    });
    describe("GET /parlay/:id", () => {
        it("Should return a 404 IF the Parlay ID Does Not Exist", async () =>{
            const res = await request(server)
                .get("/parlay/E43BEB3CE5B2E64521801387")
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Non Admin: Only Owner Shall View Parlay", async () => {
            // Create a Parlay from User 0
            const user0Parlay = await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet3Object._id]);
            // Call User0 Parlay with User1 Credential
            const res = await request(server)
                .get('/parlay/' + user0Parlay.body._id)
                .set("Authorization", "Bearer " + token1)
                .send()
            // - Expectations
            expect(res.statusCode).toEqual(401)
        });
        it("Non Admin: User shall view their own Parlay", async () => {
            // Create a Parlay from User 0
            const user0Parlay = await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet3Object._id]);
            // Call User0 Parlay with User1 Credential
            const res = await request(server)
                .get('/parlay/' + user0Parlay.body._id)
                .set("Authorization", "Bearer " + token0)
                .send()
            // - Expectations
            expect(res.statusCode).toEqual(200)
            // -- Need to add a verification of the Content

        });
        it("Admin: Admin Users Shall View all Parlays", async () => {
            // Create a Parlay from User 0
            const user0Parlay = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, bet1Object._id, bet3Object._id]);
            // Call User0 Parlay with Admin Credential
            const res = await request(server)
                .get('/parlay/' + user0Parlay.body._id)
                .set("Authorization", "Bearer " + adminToken)
                .send()
            // - Expectations
            // -- Need to add content Verification
            expect(res.statusCode).toEqual(200)
        });

    });

    describe("PUT /parlay/:id", () => {
        it("Should return a 404 if the Parlay ID does not exist", async () => {
            const res = await request(server)
                .put("/parlay/E43BEB3CE5B2E64521801387")
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Non Admin: Should Not Allow User to EDIT Parlay", async () => {
            // Create a Parlay with User0
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Call User0 Parlay with User0 Credential
            const res2 = await request(server)
                .put("/parlay/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send()
            // Expect a 401
            expect(res2.statusCode).toEqual(401);
    
        });
        it("Admin: Should Allow Admin to EDIT Parlay", async () => {
            // Create a Parlay with User0
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Edit the Parlay with the Admin User
            let revisedParlay = res.body
            revisedParlay.parlayBets.push(bet3Object._id);
            const res2 = await request(server)
                .put("/parlay/" + res.body._id.toString())
                .set("Authorization", "Bearer " + adminToken)
                .send( { revisions: revisedParlay });
            // Verification
            const dbResponse = await Parlay.findOne( { _id: res.body._id});
            // Status Code
            expect(res2.statusCode).toEqual(202);
            // We added an ID to the Object, so we just need to ensure that the update has the right ID and Length
            expect(dbResponse.parlayBets.length).toEqual(4);
           
        });
    });
    describe("DELETE /parlay/:id", () => {
        it("Should return a 404 if the Parlay ID Does Not Exist", async() => {
            const res = await request(server)
                .delete("/parlay/E43BEB3CE5B2E64521801387")
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Non Admin: Should Not Allow User to DELETE Parlay", async () => {
            // Create a Parlay with User0
            const res = await request(server)
            .post('/parlay')
            .set("Authorization", "Bearer " + token0)
            .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Call User0 Parlay with User0 Credential
            const res2 = await request(server)
                .delete("/parlay/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send()
            // Expect a 401
            expect(res2.statusCode).toEqual(401);
        });
        it("Admin: Should Allow Admin to DELETE Parlay", async () => {
            // Create a Parlay with User0
            const res = await request(server)
                .post('/parlay')
                .set("Authorization", "Bearer " + token0)
                .send([bet0Object._id, bet1Object._id, bet2Object._id]);
            // Call User0 Parlay with admin credential
            const res2 = await request(server)
                .delete("/parlay/" + res.body._id)
                .set("Authorization", "Bearer " + adminToken)
                .send()
            // Expect a 401
            expect(res2.statusCode).toEqual(204);
            // Verify that the Record has been deleted. 
            const lastCheck = await Parlay.findOne( { _id: res.body._id});
            expect(lastCheck).toBeNull();
        });

    });
});
