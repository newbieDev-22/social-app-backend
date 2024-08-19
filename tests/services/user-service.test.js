const { prismaMock } = require("../../singleton");
const userService = require("../../src/services/user-service");

describe("user service", () => {
  test("should create new user => success", async () => {
    const data = {
      email: "john@mail.com",
      firstName: "John",
      lastName: "Doe",
      password: "123456",
    };
    prismaMock.user.create.mockResolvedValue(data);
    const createUser = await userService.createUser(data);
    expect(createUser).toBeTruthy();
    expect(createUser.email).toEqual(data.email);
    expect(createUser.firstName).toEqual(data.firstName);
    expect(createUser.lastName).toEqual(data.lastName);
    expect(createUser.password).toEqual(data.password);
  });

  test("should find user by using Email => success", async () => {
    const data = {
      id: 1,
      email: "john@mail.com",
      firstName: "John",
      lastName: "Doe",
      password: "123456",
    };

    prismaMock.user.findFirst.mockResolvedValue(data);
    const findUserByEmail = await userService.findUserByEmail(data.email);
    expect(findUserByEmail).toBeTruthy();
    expect(findUserByEmail.email).toEqual(data.email);
    expect(findUserByEmail.firstName).toEqual(data.firstName);
    expect(findUserByEmail.lastName).toEqual(data.lastName);
    expect(findUserByEmail.password).toEqual(data.password);
  });

  test("should find user by using Id => success", async () => {
    const data = {
      id: 1,
      email: "john@mail.com",
      firstName: "John",
      lastName: "Doe",
      password: "123456",
    };
    prismaMock.user.findUnique.mockResolvedValue(data);
    const findUserById = await userService.findUserById(data.id);
    expect(findUserById).toBeTruthy();
    expect(findUserById.email).toEqual(data.email);
    expect(findUserById.firstName).toEqual(data.firstName);
    expect(findUserById.lastName).toEqual(data.lastName);
    expect(findUserById.password).toEqual(data.password);
  });
});
