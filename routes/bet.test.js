const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/bet");
const Bet = require("../models/bet");

describe("Testing Bet Endpoints BEFORE Login", () =>{
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    // Define Bets for Testing
    const bet0 = { terms: "Bet0 Bet Terms", price: 100 };

    describe("POST /bet", () => {
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).post("/bet").send(bet0);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).post("/bet")
            .set("Authorization", "Bearer BAD")
            .send(bet0);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /bet", () => {
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).get("/bet").send(bet0);
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).get("/bet")
            .set("Authorization", "Bearer BAD")
            .send(bet0);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /bet/:id", () => { 
        it("Should send a 401 without a Token", async () => {
            const res = await request(server).get("/bet/123456").send();
            expect(res.statusCode).toEqual(401);
        });
        it("Should send a 401 with a Bad Token", async () => {
            const res = await request(server).get("/bet/123456")
            .set("Authorization", "Bearer BAD")
            .send();
            expect(res.statusCode).toEqual(401);
        });
    });
});



describe("Testing Bet Enpoints AFTER Login", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    // Define Users for Testing
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

    let token0;
    let adminToken;

    // Define Bets for Testing
    const bet0 = { terms: "Bet0 Bet Terms", price: 100 };
    const bet1 = { terms: "Bet1 Bet Terms", price: 69 };
    beforeEach(async () => {
        await request(server).post("/auth/signup").send(user0);
        const res0 = await request(server).post("/auth/login").send(user0);
        token0 = res0.body.token;
        await request(server).post("/auth/signup").send(adminUser);
        await User.updateOne(
          { email: adminUser.email },
          { $push: { roles: "admin" } }
        );
        const res1 = await request(server).post("/auth/login").send(adminUser);
        adminToken = res1.body.token;
      });

    describe("POST /bet/", () => {
        it("Should Reject a Bet without Terms", async () => {

        });
        it("Should Reject a Bet Without a Price", async () => {

        });
        it("Should Create a Bet with all Required Fields", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            console.log("here is the response", res.body, res.statusCode);
            expect(res.statusCode).toEqual(200);
            const savedBet = await Bet.findOne( {_id: res.body._id }).lean();
            expect(res.body).toMatchObject(savedBet);

        });

    });
    describe("GET /bet/", () => {
        it("Should Return ALL Bets to an Admin User", async () => {

        });
        it("Should Return No Bets for Users that Don't have any active Bets", async () => {

        });
        it("Should return all bets that belong to the non admin user", async () => {

        });
    });
    describe("GET /bet/:id", () =>{
        it("Should return a 404 if the Bet Does Not Exist", async () => {

        });
        it("Should Not allow users to view bets of which they are not participants", async () => {

        });
        it("Should allow users to view bets of which they are participants", async () => {

        });
        it("Should allow an Admin user to view any bet", async () => {

        });

    });
    describe("DELETE /bet/:id", () => {
        it("Should return a 404 if the bet does not exist", async () => {

        });
        it("Will Not allow Non Admin Users to DELETE Bet", async () => {

        });
        it("Will allow admin user to DELETE bet", async () => {

        });
    });
    describe("PUT /bet/:id", () => {
        it("Should return a 404 if the bet does not exist", async () => {

        });
        it("Should Prevent Non-Admin User From EDITING Bet", async => {

        });
        it("Should Allow Admin User to EDIT Bet", async () => {

        });
    });
});