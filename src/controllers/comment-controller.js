const commentService = require("../services/comment-service");
const postService = require("../services/post-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const commentController = {};

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

commentController.getAllCommentsInPost = tryCatch(async (req, res, next) => {
  const { postId } = req.params;
  const posts = await commentService.getAllComments(+postId);
  res.status(200).json({ posts });
});

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
  res.status(200).json({ message: "Comment has been updated", updateComment });
});

commentController.deleteComment = tryCatch(async (req, res, next) => {
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

  await commentService.deleteComment(+commentId);
  res.status(204).end();
});

module.exports = commentController;
