const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/bet");
const Bet = require("../models/bet");

describe("Testing Parlay Enpoints", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    const paralay1 = {};
    const parlay2 = {};

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
});