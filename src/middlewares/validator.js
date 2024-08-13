const { createError } = require("../utils/create-error");
const { registerSchema, loginSchema } = require("../validators/auth-validator");

const validatorWrapper = (schema, req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    return createError({ message: error.details[0].message, statusCode: 400 });
  }
  req.input = value;
  next();
};

exports.registerValidator = (req, res, next) =>
  validatorWrapper(registerSchema, req, res, next);
exports.loginValidator = (req, res, next) =>
  validatorWrapper(loginSchema, req, res, next);
