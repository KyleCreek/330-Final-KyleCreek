const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/bet");
const Bet = require("../models/bet");
// The following assumes that the Users are valid. Validity of Users
// Are tested in the "/auth.test.js" File

describe("Testing Books Enpoints", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    // Define Bets for Testing
    const bet0 = { terms: "Bet0 Bet Terms", price: 100 };
    const bet1 = { terms: "Bet1 Bet Terms", price: 69 };

    describe("POST /bet/", () => {
        it("Should Reject a Bet without Terms", () => {

        });
        it("Should Reject a Bet Without a Price", () => {

        });
        it("Should Create a Bet with all Required Fields", () => {

        });

    });
    describe("GET /bet/", () => {
        it("Should Return ALL Bets to an Admin User", async () => {

        });
        it("Should not Return Anything to a Non Admin User", async () => {

        });
    });
    describe("GET /bet/:id", () =>{
        it("Should Not allow users to view bets of which they are not participants", async () => {

        });
        it("Should allow users to view bets of which they are participants", async () => {

        });
        it("Should allow an Admin user to view any bet", async () => {

        });

    });
    describe("DELETE /bet/:id", () => {
        it("Will Not allow Non Admin Users to DELETE Bet", async () => {

        });
        it("Will allow admin user to DELETE bet", async () => {

        });
    });
    describe("PUT /bet/:id", () => {
        it("Should Prevent Non-Admin User From EDITING Bet", async => {

        });
        it("Should Allow Admin User to EDIT Bet", async () => {

        });
    });
});