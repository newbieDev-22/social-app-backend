const hashService = require("../../src/services/hash-service");

describe("hash service", () => {
  test("hash and compare password should work", async () => {
    const password = "123456";
    const hashedPassword = await hashService.hash(password);
    const compareResult = await hashService.compare(password, hashedPassword);
    expect(compareResult).toBeTruthy();
    expect(compareResult).toEqual(true);
  });
});
