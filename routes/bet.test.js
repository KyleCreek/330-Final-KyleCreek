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

    describe("POST /bet", () => {
        it("Should Reject a Bet Without a term", async () => {

        });
        it("Should reject a Bet without a Price", async () => {

        })

    });
    describe("GET /bet", () => {
        it("Should Only Return Non Admin User Bets", async () =>{

        });
        it("Should return ALL Bets for Admin User", async () => {

        });

    });
    descibe("GET /bet/:id", () => {
        it("Should only Return Bets that belong to the User (Non-Admin)", async () => {

        });
        it("Should Not allow Non-Admin Users to access Bets they don't own", async () => {

        });
        it("Should allow an Admin User to Get ALL Bets", async () => {

        });

    });
    descibe("PUT /bet/:id", () => {
        it("Should only allow Users to edit their own Bets (Non-Admin", async => {

        });
        it("Should prevent a Non-Admin User from editing a Bet they don't own", async => {

        });
        it("Should allow an Admin User to edit any bet", async => {

        });

    });
    describe("DELETE /bet/:id", () => {
        it("Should only allow Users to delete their own Bets (Non-Admin", async => {

        });
        it("Should prevent a Non-Admin User from Deleting a Bet they don't own", async => {

        });
        it("Should allow an Admin User to Delete any bet", async => {

        });

    });


});