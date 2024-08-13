const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email({ tlds: false }),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  password: Joi.string()
    .required()
    .pattern(/^[0-9a-zA-Z]{6,}$/),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).strip(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().required().trim(),
  password: Joi.string().required(),
});
