const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");

// Note -- Everything Below has beenstolen from Previous Homeworks.
// This needs to be edited for my purposes. 

describe("/auth", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const user0 = {
    firstName: "user0First",
    lastName: "user0Last",
    email: "user0@gmail.com",
    password: "pass1234",
  };
  const user1 = {
    firstName: "user1First",
    lastName: "user1Last",
    email: "user1@gmail.com",
    password: "pass1234",
  };

  describe("before signup", () => {
    describe("POST /auth/", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/auth/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe("signup ", () => {
    describe("POST /auth/signup", () => {
      it("should return 400 without a password", async () => {
        const res = await request(server).post("/auth/signup").send({
            firstName: user0.firstName,
            lastName: user0.lastName,
            email: user0.email,
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 400 with empty password", async () => {
        const res = await request(server).post("/auth/signup").send({
            firstName: user1.firstName,
            lastName: user1.lastName,
            email: user1.email,
            password: "",
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 200 and with a password", async () => {
        const res = await request(server).post("/auth/signup").send(user1);
        expect(res.statusCode).toEqual(200);
      });
      it("should return 409 Conflict with a repeat signup", async () => {
        let res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(200);
        res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });
      it("should not store raw password", async () => {
        await request(server).post("/auth/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user).includes(user0.password)).toBe(false);
        });
      });
    });
  });

  describe.each([user0, user1])("User %#", (user) => {
    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      await request(server).post("/auth/signup").send(user1);
    });

    describe("POST /", () => {
      it("should return 400 when password isn't provided", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 401 when password doesn't match", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
          password: "badPassword",
        });
        expect(res.statusCode).toEqual(401);
      });
      it("should return 200 and a token when password matches", async () => {
        const res = await request(server).post("/auth/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body.token).toEqual("string");
      });
      it("should not store token on user", async () => {
        const res = await request(server).post("/auth/login").send(user0);
        const token = res.body.token;
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(token);
        });
      });
      it("should return a JWT with user email, _id, and roles inside, but not password", async () => {
        const res = await request(server).post("/auth/login").send(user);
        const token = res.body.token;
        const decodedToken = jwt.decode(token);
        expect(decodedToken.email).toEqual(user.email);
        expect(decodedToken.roles).toEqual(["user"]);
        expect(decodedToken._id).toMatch(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
        ); // mongo _id regex
        expect(decodedToken.password).toBeUndefined();
      });
    });
  });
});
