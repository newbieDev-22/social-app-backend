const request = require("supertest");
const app = require("../../app");
const jwtService = require("../../src/services/jwt-service");
const userService = require("../../src/services/user-service");

jest.mock("../../src/services/user-service.js");
jest.mock("../../src/services/jwt-service");

describe("authenticate middleware", () => {
  test("authenticate with valid token should work", async () => {
    const token = "test-token";
    const dbData = {
      id: 1,
      email: "john@mail.com",
      firstName: "John",
      lastName: "Doe",
      password: "$2a$12$w12F51MEVuQT.N.g1rAwiemxOSG.AI8r4.8Y03A//PAFt455U1JFW",
      createdAt: "2022-01-01T00:00:00.000Z",
    };

    jwtService.verify.mockReturnValue({ id: 1 });
    userService.findUserById.mockReturnValue(dbData);

    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });

  test("authenticate with no bearer token should not work", async () => {
    const token = "test-token";

    const response = await request(app).get("/posts").set("Authorization", token);
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  test("authenticate with invalid token should not work", async () => {
    const token = "test-token";

    jwtService.verify.mockReturnValue({ id: 1 });
    userService.findUserById.mockReturnValue(null);

    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("User not found");
  });
});
