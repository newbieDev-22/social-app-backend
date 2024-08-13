const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const authController = {};

/**
 * Register a new user.
 *
 * @route POST /register
 * @group Auth - Operations for user authentication
 * @param {string} email.body.required - The email of the user.
 * @param {string} firstName.body.required - The first name of the user.
 * @param {string} lastName.body.required - The last name of the user.
 * @param {string} password.body.required - The password of the user.
 * @param {string} confirmPassword.body.required - The confirmation password of the user.
 * @returns {object} 201 - Success message.
 * @returns {Error} 409 - Email already in use.
 * @returns {Error} 400 - Invalid input.
 * @returns {Error} 500 - Internal server error.
 */
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

/**
 * Log in a user.
 *
 * @route POST /login
 * @group Auth - Operations for user authentication
 * @param {string} email.body.required - The email of the user.
 * @param {string} password.body.required - The password of the user.
 * @returns {string} 200 - The access token.
 * @returns {Error} 400 - Invalid credentials.
 * @returns {Error} 400 - Invalid input.
 * @returns {Error} 500 - Internal server error.
 */
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

/**
 * Get the current user.
 *
 * @route GET /get-me
 * @group Auth - Operations for user authentication
 * @returns {object} 200 - The current user.
 * @returns {Error} 500 - Internal server error.
 */
authController.getMe = tryCatch(async (req, res, next) => {
  res.status(200).json({ user: req.user });
});

module.exports = authController;
