const Joi = require("joi");

const postSchema = {};

postSchema.createPost = Joi.object({
  message: Joi.string().required(),
});

module.exports = postSchema;
