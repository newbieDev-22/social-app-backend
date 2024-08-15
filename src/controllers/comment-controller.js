const commentService = require("../services/comment-service");
const postService = require("../services/post-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const commentController = {};

/**
 * Create a new comment
 * @name POST /post/:postId/
 * @body {string} message - The content of the comment
 * @returns {object} 201 - Success response, The comment object
 * @returns {object} 400 - Bad request
 * @returns {Error} - Internal server error
 */
commentController.createComment = tryCatch(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postService.findPostById(+postId);
  if (!post) {
    createError({
      message: "Post not found",
      statusCode: 400,
    });
  }

  const data = {
    userId: req.user.id,
    postId: +postId,
    message: req.body.message,
  };

  const newComment = await commentService.createComment(data);
  res.status(201).json({ message: "Comment has been created", comment: newComment });
});

/**
 * Get all comments in a post
 * @name GET /post/:postId/
 * @returns {object} 200 - Success response
 * @returns {object} posts - An array of comments

 * @returns {Error} - Internal server error
 */
commentController.getAllCommentsInPost = tryCatch(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postService.findPostById(+postId);
  if (!post) {
    return res.status(200).json({ comments: [] });
  }
  const comments = await commentService.getAllComments(+postId);
  res.status(200).json({ comments });
});

/**
 * Update a comment
 * @name PATCH /:commentId/
 * @body {string} message - The content of the comment
 * @returns {object} 200 - Success response, The updated comment object
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {Error} - Internal server error
 */
commentController.updateComment = tryCatch(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await commentService.findCommentById(+commentId);
  if (!comment) {
    createError({
      message: "Comment not found",
      statusCode: 400,
    });
  }

  if (comment.userId !== req.user.id) {
    createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  const data = req.body;
  const updateComment = await commentService.updateComment(+commentId, data);
  res.status(200).json({ message: "Comment has been updated", comment: updateComment });
});

/**
 * Delete a comment
 * @name DELETE /:commentId/
 * @returns {object} 204 - Success response, No content
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {Error} - Internal server error
 */
commentController.deleteComment = tryCatch(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await commentService.findCommentById(+commentId);
  if (!comment) {
    return res.status(204).end();
  }

  if (comment.userId !== req.user.id) {
    createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await commentService.deleteComment(+commentId);
  res.status(204).end();
});

module.exports = commentController;
