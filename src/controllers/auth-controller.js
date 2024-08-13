const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const authController = {};

authController.register = tryCatch(async (req, res, next) => {
  const data = req.input;
  const existUser = await userService.findUserByEmail(data?.email);

  if (existUser) {
    createError({
      message: "Email already in use",
      statusCode: 409,
    });
  }

  data.password = await hashService.hash(data.password);
  await userService.createUser(data);
  res.status(201).json({ message: "User created" });
});

authController.login = tryCatch(async (req, res, next) => {
  const data = req.input;
  const existUser = await userService.findUserByEmail(data.email);
  if (!existUser) {
    createError({
      message: "Invalid credentials",
      statusCode: 400,
    });
  }

  const isMatch = await hashService.compare(data.password, existUser.password);
  if (!isMatch) {
    createError({
      message: "Invalid credentials",
      statusCode: 400,
    });
  }

  const accessToken = jwtService.sign({ id: existUser.id });
  res.status(200).json({ accessToken });
});

authController.getMe = tryCatch(async (req, res, next) => {
  res.status(200).json({ user: req.user });
});

module.exports = authController;
