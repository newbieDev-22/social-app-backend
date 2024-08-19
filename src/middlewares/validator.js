const createError = require("../utils/create-error");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const { createComment } = require("../validators/comment-validator");
const { createPost } = require("../validators/post-validator");

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
exports.createPostValidator = (req, res, next) =>
  validatorWrapper(createPost, req, res, next);
exports.createCommentValidator = (req, res, next) =>
  validatorWrapper(createComment, req, res, next);
