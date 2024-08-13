const Joi = require("joi");

const commentSchema = {};

commentSchema.createComment = Joi.object({
  message: Joi.string().required(),
});

module.exports = commentSchema;
