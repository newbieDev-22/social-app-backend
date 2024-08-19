const request = require("supertest");
const userService = require("../../src/services/user-service");
const app = require("../../app");

jest.mock("../../src/services/user-service.js");

describe("Auth controller", () => {
  describe("Register", () => {
    test("POST /auth/register should return 201", async () => {
      const data = {
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
        password: "123456",
        confirmPassword: "123456",
      };

      userService.createUser.mockReturnValue(data);

      const response = await request(app)
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual("User created");
    });

    test("POST /auth/register with already exist email should return 409", async () => {
      const data = {
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
        password: "123456",
        confirmPassword: "123456",
      };

      userService.findUserByEmail.mockReturnValue(data);

      const response = await request(app)
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(data);

      expect(response.status).toEqual(409);
      expect(response.body.message).toEqual("Email already in use");
    });

    test("POST /auth/register with empty some field should return 400", async () => {
      const data = {
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
        password: "123456",
        confirmPassword: "123456",
      };

      const keys = Object.keys(data);

      for (let i = 0; i < keys.length; i++) {
        const dummyData = { ...data };
        dummyData[keys[i]] = "";
        const response = await request(app)
          .post("/auth/register")
          .set("Accept", "application/json")
          .send(dummyData);

        expect(response.status).toEqual(400);
      }
    });

    test("POST /auth/register with wrong password format should return 400", async () => {
      const data = {
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
        password: "123456!!",
        confirmPassword: "123456!!",
      };

      const response = await request(app)
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(data);

      expect(response.status).toEqual(400);
    });

    test("POST /auth/register with password and confirm password not match should return 400", async () => {
      const data = {
        email: "john@mail.com",
        firstName: "John",
        lastName: "Doe",
        password: "123456",
        confirmPassword: "654321",
      };

      const response = await request(app)
        .post("/auth/register")
        .set("Accept", "application/json")
        .send(data);

      expect(response.status).toEqual(400);
    });
  });

  describe("Login", () => {
    test("POST /auth/login should return 200 with access token", async () => {
      const rawData = {
        email: "john@mail.com",
        password: "123456",
      };

      const dbData = {
        email: "john@mail.com",
        password: "$2a$12$w12F51MEVuQT.N.g1rAwiemxOSG.AI8r4.8Y03A//PAFt455U1JFW",
      };

      userService.findUserByEmail.mockReturnValue(dbData);

      const response = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(rawData);

      expect(response.status).toEqual(200);
    });

    test("POST /auth/login with not exist email should return 400", async () => {
      const rawData = {
        email: "notexistmail@mail.com",
        password: "123456",
      };

      userService.findUserByEmail.mockReturnValue(null);

      const response = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(rawData);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid credentials");
    });

    test("POST /auth/login with wrong password should return 400", async () => {
      const rawData = {
        email: "john@mail.com",
        password: "654321",
      };

      const dbData = {
        email: "john@mail.com",
        password: "$2a$12$w12F51MEVuQT.N.g1rAwiemxOSG.AI8r4.8Y03A//PAFt455U1JFW",
      };

      userService.findUserByEmail.mockReturnValue(dbData);

      const response = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send(rawData);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid credentials");
    });
  });
});
