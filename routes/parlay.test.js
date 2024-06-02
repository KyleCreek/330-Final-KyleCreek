const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/bet");
const Bet = require("../models/bet");
const Parlay = require("../models/parlay");

describe("Testing Parlay Endpoints BEFORE Log In", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    const parlay1 = {};
    const parlay2 = {};

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
                .send([bet0Object._id, bet1Object._id, bet2Object._id]);
        });
        it("Should Create a Parlay With 2 or More Bets", async () => {

        });
        it("Should Properly Calculate the Cost of the Parlay", async () => {

        });
    });

});
    /*
    describe("POST /parlay/", () => {
        it("Should Reject Parlays with less than 2 Bets", async () =>{

        });
        it("Should Reject Parlays When Provided Invalid Bet Ids", async () => {

        });
        it("Should Create a Parlay With 2 or More Bets", async () => {

        });
    });

    describe("GET /parlay/", () => {
        it("Non-Admin: Should only Return Bets of Which User is Participant", async () => {

        });
        it("Admin: Should Return All Parlays", async () => {

        });
    });
    describe("GET /parlay/:id", () => {
        it("Should return a 404 IF the Parlay ID Does Not Exist", async () =>{

        });
        it("Non Admin: Only Owner Shall View Parlay", async () => {

        });
        it("Non Admin: User shall view their own Parlay", async () => {

        });
        it("Admin: Admin Users Shall View all Parlays", async () => {

        });

    });
    describe("DELETE /parlay/:id", () => {
        it("Should return a 404 if the Parlay ID Does Not Exist", async() => {

        });
        it("Non Admin: Should Not Allow User to DELETE Parlay", async () => {

        });
        it("Admin: Should Allow Admin to DELETE Parlay", async () => {

        });

    });
    describe("PUT /parlay/:id", () => {
        it("Should return a 404 if the Parlay ID does not exist", async () => {

        });
        it("Non Admin: Should Not Allow User to EDIT Parlay", async () => {

        });
        it("Admin: Should Allow Admin to EDIT Parlay", async () => {

        });

    });
    */
