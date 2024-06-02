const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
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

    const user1 = {
        firstName: "User1",
        lastName: "chadsworth",
        email: "user1@yahoo.com",
        password: "pass456"
    };

    let token0;
    let token1;
    let adminToken;

    // Define Bets for Testing
    const bet0 = { terms: "Bet0 Bet Terms", price: 100 };
    const bet1 = { terms: "Bet1 Bet Terms", price: 69 };
    beforeEach(async () => {
        // Define and Log In User 0
        await request(server).post("/auth/signup").send(user0);
        const res0 = await request(server).post("/auth/login").send(user0);
        token0 = res0.body.token;
        // Define and Log In User 1
        await request(server).post("/auth/signup").send(user1);
        const res1 = await request(server).post("/auth/login").send(user1);
        token1 = res1.body.token;
        await request(server).post("/auth/signup").send(adminUser);
        // Define and Log In Admin User
        const adminRoles = { roles: ['admin', 'user' ]};
        await User.updateOne({ email: adminUser.email }, adminRoles);
        const resadmin = await request(server).post("/auth/login").send(adminUser);
        adminToken = resadmin.body.token;
      });

    describe("POST /bet/", () => {
        it("Should Reject a Bet without Terms", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send({price: "10"});
            expect(res.statusCode).toEqual(400);
        });
        it("Should Reject a Bet with Empty Terms", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send({terms: "", price: "10"});
            expect(res.statusCode).toEqual(400);      
        })
        it("Should Reject a Bet Without a Price", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send({"terms": "Theses are Just Terms"});
            expect(res.statusCode).toEqual(400);
        });
        it("Should Reject a Bet with a Negative Price", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send({"terms": "Theses are Just Terms", price: -500});
            expect(res.statusCode).toEqual(400);
        });
        it("Should reject a Bet with a NaN Price", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send({"terms": "Theses are Just Terms", price: 'bad'});
            expect(res.statusCode).toEqual(400);
        });
        it("Should Create a Bet with all Required Fields", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            expect(res.statusCode).toEqual(200);
            const savedBet = await Bet.findOne( {_id: res.body._id }).lean();
            expect(res.body).toMatchObject({
                betInitiator: savedBet['betInitiator'].toString(),
                betAcceptor: null,
                terms: bet0['terms'],
                price: bet0['price'],
                _id: savedBet._id.toString()
            });

        });

    });
    describe("GET /bet/", () => {
        it("Should Return ALL Bets to an Admin User", async () => {
            // Add Both Bets to the database
            const res1 = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            const res2 = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet1);
            // Make a call with the Admin TOken
            const res3 = await request(server)
                .get("/bet")
                .set("Authorization", "Bearer " + adminToken)
                .send();
            // Verify a 200 Response is Recived
            expect(res3.statusCode).toEqual(200);
            expect(res3.body.length).toEqual(2);
        });
        it("Should return all bets that belong to the non admin user", async () => {
            // Create two Bets/ one from admin the other from non admin
            const res1 = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            const res2 = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + adminToken)
                .send(bet1);
            // Make a Call with the Non Admin Token
            const res3 = await request(server)
                .get("/bet")
                .set("Authorization", "Bearer " + token0)
                .send();
            // Verify a 200 Response w/ only one bet is Recieved
            expect(res3.statusCode).toEqual(200);
            expect(res3.body.length).toEqual(1);
        });
    });
    describe("GET /bet/:id", () =>{
        it("Should return a 404 if the Bet Does Not Exist", async () => {
            const res = await request(server)
                .get('/bet/2EF1EC23E0885FC7044A9B26')
                .set("Authorization", "Bearer " + adminToken)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Should Not allow users to view bets of which they are not participants", async () => {
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + adminToken)
                .send(bet0);
            const res2 = await request(server)
                .get("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res2.status).toEqual(403);
        });

        it("Should allow Bet Initiator to view Bet", async () => {
            // Create a Bet made by user0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            const savedBet = await Bet.findOne( {_id: res.body._id }).lean();
            // Call the Endpoint with the Admin Token
            const res2 = await request(server)
                .get("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res2.status).toEqual(200);
            expect(res2.body).toMatchObject({
                betInitiator: savedBet['betInitiator'].toString(),
                betAcceptor: null,
                terms: bet0['terms'],
                price: bet0['price'],
                _id: savedBet._id.toString()
                });
        });

        it("Should allow Bet Acceptor to View Bet", async () => {
            // Create a Bet Made By User0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            // Obtain the User1 Object
            const respUser1 = await User.findOne({email: user1.email})
            // Add User1 as a "betAcceptor"
            const updateBet = await Bet.updateOne({ _id: res.body._id}, {betAcceptor: respUser1._id});
            const savedBet = await Bet.findOne( {_id: res.body._id }).lean();
            // Request and View Bet as User1
            const res2 = await request(server)
            .get("/bet/" + res.body._id)
            .set("Authorization", "Bearer " + token1)
            .send();
            // Verify Status is 200 and data is correct
            expect(res2.status).toEqual(200);
            expect(res2.body).toMatchObject({
                betInitiator: savedBet['betInitiator'].toString(),
                betAcceptor: savedBet['betAcceptor'].toString(),
                terms: bet0['terms'],
                price: bet0['price'],
                _id: savedBet._id.toString()
                });
        });

        it("Should allow an Admin user to view any bet", async () => {
            // Create a Bet made by user0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            const savedBet = await Bet.findOne( {_id: res.body._id }).lean();
            // Call the Endpoint with the Admin Token
            const res2 = await request(server)
                .get("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + adminToken)
                .send();
            expect(res2.status).toEqual(200);
            expect(res2.body).toMatchObject({
                betInitiator: savedBet['betInitiator'].toString(),
                betAcceptor: null,
                terms: bet0['terms'],
                price: bet0['price'],
                _id: savedBet._id.toString()
                });
            });
    });
    describe("DELETE /bet/:id", () => {
        it("Should return a 404 if the bet does not exist", async () => {
            const res = await request(server)
                .delete('/bet/2EF1EC23E0885FC7044A9B26')
                .set("Authorization", "Bearer " + adminToken)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Will Not allow Non Admin Users to DELETE Bet", async () => {
            // Create a Bet made by user0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            // Call the Endpoint with the Admin Token
            const res2 = await request(server)
                .delete("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res2.status).toEqual(403);
        });
        it("Will allow admin user to DELETE bet", async () => {
            // Create a Bet made by user0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            // Call the Endpoint with the Admin Token
            const res2 = await request(server)
                .delete("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + adminToken)
                .send();
            // Verify Correct Status has been recieved
            expect(res2.status).toEqual(400);
            // Verify Bet Does not appear
            const lastCheck = await Bet.findOne({_id: res.body._id});
            expect(lastCheck).toBeNull();
        });
    });
    describe("PUT /bet/:id", () => {
        it("Should return a 404 if the bet does not exist", async () => {
            const res = await request(server)
                .delete('/bet/2EF1EC23E0885FC7044A9B26')
                .set("Authorization", "Bearer " + adminToken)
                .send();
            expect(res.statusCode).toEqual(404);
        });
        it("Should Prevent Non-Admin User From EDITING Bet", async () => {
            // Create a Bet made by user0
            const res = await request(server)
                .post("/bet")
                .set("Authorization", "Bearer " + token0)
                .send(bet0);
            // Call the Endpoint with the Admin Token
            const res2 = await request(server)
                .put("/bet/" + res.body._id)
                .set("Authorization", "Bearer " + token0)
                .send();
            expect(res2.status).toEqual(403);
        });
        it("Should Allow Admin User to EDIT Bet", async () => {

        });
    });
});