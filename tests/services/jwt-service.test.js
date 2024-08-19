const jwtService = require("../../src/services/jwt-service");

describe("jwt service", () => {
  test("jwt sign and verify should work", () => {
    const payload = { name: "test" };
    const token = jwtService.sign(payload);
    const resultVerify = jwtService.verify(token);
    expect(resultVerify).toBeTruthy();
    expect(resultVerify).toMatchObject(payload);
  });
});
