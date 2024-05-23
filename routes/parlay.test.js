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

});